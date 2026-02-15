data "aws_ami" "ubuntu_2204" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

locals {
  user_data = <<-EOT
    #!/bin/bash
    set -euxo pipefail

    apt-get update
    apt-get install -y nginx jq awscli

    mkdir -p /opt/edge-proxy

    cat > /opt/edge-proxy/render-nginx.sh <<'EOF'
    #!/usr/bin/env bash
    set -euo pipefail

    AWS_REGION="${var.region}"
    CLUSTER="${var.cluster_name}"
    APP_DOMAIN="${var.app_domain_name}"
    ROOT_DOMAIN="${var.domain_name}"

    get_upstreams() {
      local service_name="$1"
      local port="$2"
      local task_arns
      task_arns=$(aws ecs list-tasks --region "$AWS_REGION" --cluster "$CLUSTER" --service-name "$service_name" --desired-status RUNNING --query 'taskArns' --output text 2>/dev/null || true)
      if [[ -z "$task_arns" || "$task_arns" == "None" ]]; then
        return 0
      fi

      aws ecs describe-tasks --region "$AWS_REGION" --cluster "$CLUSTER" --tasks $task_arns --query 'tasks[].attachments[].details[?name==`privateIPv4Address`].value' --output text 2>/dev/null \
        | tr '\t' '\n' \
        | awk 'NF { print $1 ":" '"$port"' }'
    }

    render_upstream_block() {
      local name="$1"
      local svc="$2"
      local port="$3"
      mapfile -t upstreams < <(get_upstreams "$svc" "$port")
      echo "upstream $name {"
      if [[ "$${#upstreams[@]}" -eq 0 ]]; then
        echo "  server 127.0.0.1:65535;"
      else
        for u in "$${upstreams[@]}"; do
          echo "  server $u;"
        done
      fi
      echo "}"
    }

    WEB_UPSTREAM="$(render_upstream_block web_upstream demo-web 3000)"
    API_UPSTREAM="$(render_upstream_block api_upstream demo-api 3001)"
    TERM_UPSTREAM="$(render_upstream_block terminal_upstream demo-terminal-gateway 3403)"
    ENV_UPSTREAM="$(render_upstream_block ingress_upstream demo-ingress-router 3402)"

    cat > /etc/nginx/conf.d/edge-proxy.conf <<NGINX
    $WEB_UPSTREAM
    $API_UPSTREAM
    $TERM_UPSTREAM
    $ENV_UPSTREAM

    map \$http_upgrade \$connection_upgrade {
      default upgrade;
      '' close;
    }

    server {
      listen 80;
      server_name $APP_DOMAIN;
      location / {
        proxy_pass http://web_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
      }
    }

    server {
      listen 80;
      server_name api.$APP_DOMAIN;
      location / {
        proxy_pass http://api_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
      }
    }

    server {
      listen 80;
      server_name terminal.$APP_DOMAIN;
      location / {
        proxy_pass http://terminal_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
      }
    }

    server {
      listen 80;
      server_name ~^.*\\.dev\\.$ROOT_DOMAIN$ ~^.*\\.prod\\.$ROOT_DOMAIN$;
      location / {
        proxy_pass http://ingress_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
      }
    }
    NGINX

    nginx -t
    systemctl reload nginx
    EOF

    chmod +x /opt/edge-proxy/render-nginx.sh

    cat > /etc/systemd/system/edge-proxy-refresh.service <<'EOF'
    [Unit]
    Description=Refresh Nginx upstreams from ECS tasks
    After=network-online.target nginx.service
    Wants=network-online.target

    [Service]
    Type=oneshot
    ExecStart=/opt/edge-proxy/render-nginx.sh
    EOF

    cat > /etc/systemd/system/edge-proxy-refresh.timer <<'EOF'
    [Unit]
    Description=Refresh edge proxy upstreams every 30 seconds

    [Timer]
    OnBootSec=20s
    OnUnitActiveSec=30s
    Unit=edge-proxy-refresh.service

    [Install]
    WantedBy=timers.target
    EOF

    systemctl daemon-reload
    systemctl enable --now nginx
    systemctl enable --now edge-proxy-refresh.timer
    /opt/edge-proxy/render-nginx.sh
  EOT
}

resource "aws_instance" "this" {
  ami                         = data.aws_ami.ubuntu_2204.id
  instance_type               = var.instance_type
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [var.security_group_id]
  iam_instance_profile        = var.instance_profile_name
  associate_public_ip_address = true
  user_data                   = local.user_data
  user_data_replace_on_change = true

  tags = merge(var.tags, { Name = "demo-edge-proxy" })
}

resource "aws_eip" "this" {
  domain = "vpc"
  tags   = merge(var.tags, { Name = "demo-edge-proxy-eip" })
}

resource "aws_eip_association" "this" {
  allocation_id = aws_eip.this.id
  instance_id   = aws_instance.this.id
}
