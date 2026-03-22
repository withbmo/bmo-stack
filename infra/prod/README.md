# Prod Infra (ECS/Fargate)

This stack provisions a production-like AWS baseline for running the monorepo services on **ECS/Fargate** behind a public **Application Load Balancer**.

It is intentionally “from scratch” and does not depend on `infra/demo`.

## What this stack creates

- 2–3 AZ VPC with public/private/db subnets and NAT gateways
- Public ALB with target groups for:
  - `web` (port 3000)
  - `api` (port 3001; health check `/api/v1/health`)
- ECS cluster + Fargate services + autoscaling (CPU target tracking)
- IAM roles:
  - ECS execution role (pull images + write logs + read Secrets Manager)
  - ECS task role (optionally includes ECS Exec permissions)
- Secrets Manager placeholders:
  - DB runtime (currently named `.../db/prod-supabase`)
  - optional DB direct-host migration (`.../db/prod-supabase-direct`)
  - API runtime (`.../api/prod-runtime`)
- Optional ECR repositories (off by default)

## Routing modes

- `routing_mode="path"` (default): routes the API by path pattern `/api/*` on the same ALB host (no DNS required).
- `routing_mode="host"` (recommended): routes by hostname:
  - `web`: `https://<app_domain>`
  - `api`: `https://api.<app_domain>`

## Required container images (important)

Terraform expects container images for `web` and `api` via `var.images`.

This stack does **not** build images. Use CI/CD (GitHub Actions) to build/push to ECR, then update the service task definition via your deploy pipeline.

## Secret payloads

### DB runtime secret (used by the API)

Secret name:

- `${project_name}/db/prod-supabase` (or set `db_runtime_secret_arn` to a different secret)

Expected JSON payload:

```json
{
  "host": "db.example.com",
  "port": "5432",
  "dbname": "postgres",
  "username": "postgres",
  "password": "your-password",
  "sslmode": "require"
}
```

### API runtime secret

Secret name:

- `${project_name}/api/${environment}-runtime`

Minimum JSON payload for this repo to boot cleanly:

```json
{
  "JWT_SECRET": "change-me",
  "ENV_SESSION_SECRET": "change-me"
}
```

## Usage

1. Configure the backend in `infra/prod/backend.tf` (S3 state + DynamoDB locks).
2. Deploy:

```bash
cd infra/prod
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

3. Populate secrets after apply:

```bash
aws secretsmanager put-secret-value \
  --secret-id "<db runtime secret arn or name>" \
  --secret-string '{"host":"db.example.com","port":"5432","dbname":"postgres","username":"postgres","password":"...","sslmode":"require"}'
```

```bash
aws secretsmanager put-secret-value \
  --secret-id "<api runtime secret arn or name>" \
  --secret-string '{"JWT_SECRET":"...","ENV_SESSION_SECRET":"..."}'
```

## Common next steps

- Switch to `routing_mode="host"` + `enable_https=true` + `certificate_arn=...`, then set `manage_root_dns=true` to create Route53 alias records.
- Add RDS/ElastiCache/S3 modules (or point the API at externally managed services via `api_env` + secrets).
