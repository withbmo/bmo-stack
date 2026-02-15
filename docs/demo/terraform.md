# Demo platform (AWS) — Terraform guide

Terraform root: `infra/demo/`

## State backend

`infra/demo/backend.tf` configures an S3 backend + DynamoDB locks.

You must have:

- An S3 bucket for state
- A DynamoDB table for locks (hash key `LockID` as string)

The repo includes a bootstrap stack for that: `infra/bootstrap/`.

## Module map

`infra/demo/main.tf` wires the demo stack from these modules:

### Networking

- `servicesvpc/`: ServicesVPC `10.10.0.0/16`
  - 2 public + 2 private subnets
  - IGW + NAT gateway
  - VPC endpoints (STS/SSM/ECR/Logs/S3)
- `envsvpc/`: EnvsVPC `10.50.0.0/16`
  - 2 public + 2 private subnets
  - IGW + NAT gateway
  - VPC endpoints (SSM/ECR/S3)
- `tgw/`: Transit Gateway + attachments + private routes
  - Services private route tables route `10.50.0.0/16` via TGW
  - Envs private route tables route `10.10.0.0/16` via TGW

### Security

- `security/`: Security groups
  - ALB SGs: inbound 80/443 from `0.0.0.0/0`
  - ECS SG:
    - 3000, 3001, 3403 from app ALB SG
    - 3402 from env ALB SG
    - 3401 from ServicesVPC CIDR
  - Env VM SG:
    - 8080 from ServicesVPC CIDR
    - 9000–9999 from ServicesVPC CIDR

### Data

- `postgres/`: RDS Postgres instances (dev + prod) and Secrets Manager master secrets
- `secrets/`: app secrets in Secrets Manager
  - `${project_name}/api/jwt-secret`
  - `${project_name}/platform/env-session-secret`
- `dynamodb/`: DynamoDB table `EnvRouting`
  - PK: `host` (string)
  - GSI: `envId-index` (hash: `envId`)

### Compute substrate

- `compute/`: EC2 Launch Template for environment VMs
  - Ubuntu 22.04 AMI
  - installs Docker + `docker compose`
  - runs a demo nginx container publishing `8080:80`

### Optional edge

- `alb_app/`: `demo-app-alb` + listener rules for:
  - `api.${app_domain_name}` → API target group
  - `terminal.${app_domain_name}` → terminal target group
  - default → web target group
- `alb_env/`: `demo-env-alb` forwarding to ingress-router target group
- `dns_acm/`: ACM certs + “required DNS records” output (zone is managed externally by default)

### ECS services

- `ecs/shared/`: ECS cluster `demo-services-cluster` with container insights
- `ecs/web/`: service `demo-web` (port 3000)
- `ecs/api/`: service `demo-api` (port 3001)
  - injects DB host/port/name as env vars
  - injects DB user/password + JWT/ENV secrets from Secrets Manager
- `ecs/ingress-router/`: service `demo-ingress-router` (port 3402) + autoscaling
- `ecs/terminal-gateway/`: service `demo-terminal-gateway` (port 3403) + autoscaling
- `ecs/orchestrator/`: service `demo-orchestrator` (port 3401) + autoscaling

## Key variables

From `infra/demo/variables.tf`:

- `region` (default `us-east-1`)
- `project_name` (default `pytholit-demo`)
- `domain_name` (default `pytholit.dev`)
- `app_domain_prefix` (default `""`)
- `enable_alb` / `enable_dns_acm` (both default `false`)
- `api_database_env` (`dev|prod`, default `dev`)
- `postgres_instances` (map, dev+prod)
- `images` (object): ECS image URLs for each service

Environment tfvars:

- `infra/demo/dev.tfvars`: `app_domain_prefix = "dev"`, `api_database_env = "dev"`
- `infra/demo/prod.tfvars`: `app_domain_prefix = ""`, `api_database_env = "prod"`

## Useful outputs

From `infra/demo/outputs.tf`:

- `external_dns_records_required` (when `enable_dns_acm=true`)
- `env_routing_table_name` (DynamoDB `EnvRouting`)
- `env_launch_template_id` (EC2 Launch Template for env VMs)
- `postgres_endpoints`, `postgres_master_secret_arns`
- `app_alb_dns_name`, `env_alb_dns_name` (when `enable_alb=true`)

