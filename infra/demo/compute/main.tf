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
    set -eux
    apt-get update

    # Install AWS SSM Agent via snap (Ubuntu 22.04 recommended method).
    # Must be installed before Docker so it registers with Systems Manager
    # before the network is saturated by container traffic.
    # --classic confinement is required: the agent needs host-level access
    # (process management, filesystem, network) blocked under strict snap confinement.
    snap install amazon-ssm-agent --classic
    systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service
    systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service

    apt-get install -y docker.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker

    cat >/opt/demo-compose.yml <<'EOF'
    services:
      app:
        image: public.ecr.aws/docker/library/nginx:stable
        ports:
          - "8080:80"
    EOF

    docker compose -f /opt/demo-compose.yml up -d
  EOT
}

resource "aws_launch_template" "env_vm" {
  name_prefix   = "demo-env-vm-"
  image_id      = data.aws_ami.ubuntu_2204.id
  instance_type = "t3.small"

  iam_instance_profile {
    name = var.instance_profile_name
  }

  vpc_security_group_ids = var.security_group_ids

  user_data = base64encode(local.user_data)

  tag_specifications {
    resource_type = "instance"
    tags = merge(var.tags, {
      Name = "demo-env-vm"
    })
  }
}

// launch template output removed; env provisioning no longer depends on a single template id
