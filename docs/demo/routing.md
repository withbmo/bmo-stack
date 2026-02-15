# Routing (env URLs → the right VM)

This demo intends to support requests like:

- `https://env-<envId>.dev.pytholit.dev/...`
- `https://env-<envId>.prod.pytholit.dev/...`

## DNS + certificates

Terraform module: `infra/demo/dns_acm/`

When `enable_dns_acm=true`:

- ACM certs are created for:
  - app/api/terminal hostnames
  - `*.dev.pytholit.dev` and `*.prod.pytholit.dev`
- Output `external_dns_records_required` includes:
  - CNAMEs for:
    - app root (`<app_domain_name>`)
    - `api.<app_domain_name>`
    - `terminal.<app_domain_name>`
    - `*.dev.<domain_name>`
    - `*.prod.<domain_name>`
  - ACM validation CNAME records

By default `public_zone_managed_externally=true`, so you create these records in your DNS provider (the repo mentions GoDaddy).

## ALBs

Terraform modules (created only when `enable_alb=true`):

### App ALB (`infra/demo/alb_app/`)

- ALB: `demo-app-alb`
- Listener rules route by Host header:
  - `api.<app_domain_name>` → target group `demo-api-tg` (3001)
  - `terminal.<app_domain_name>` → target group `demo-term-tg` (3403)
  - default → target group `demo-web-tg` (3000)
- Idle timeout is set to 3600 seconds (useful for WebSocket-style connections)

### Env ALB (`infra/demo/alb_env/`)

- ALB: `demo-env-alb`
- Default forwards to target group `demo-ingress-tg` (3402 → ingress-router)

## Ingress-router (planned data-plane)

App: `apps/ingress-router`

Current behavior (`apps/ingress-router/src/main.ts`):

- Exposes `GET /health`
- Handles `ALL /svc/:serviceKey/*`
  - Validates a proxy JWT (Bearer token or `x-pytholit-proxy-token`)
  - OR accepts `x-pytholit-api-key` (mode not yet implemented end-to-end)
  - Returns a JSON stub response indicating the token was validated
  - Includes a note: “Attach DynamoDB route lookup + TGW forwarding next.”

### Intended forwarding model

The intended routing model (matching Terraform resources) is:

1) Request arrives at env wildcard ALB (`demo-env-alb`)
2) ALB forwards to `demo-ingress-router` on ECS (3402)
3) ingress-router derives a `host` key and looks it up in DynamoDB `EnvRouting`
4) ingress-router forwards the HTTP request to the env VM private IP (via TGW)

## DynamoDB `EnvRouting`

Terraform: `infra/demo/dynamodb/main.tf`

- Table: `EnvRouting`
- PK: `host` (string)
- GSI: `envId-index` (hash: `envId`)

The table is intended to map a hostname (or host-derived key) to the target VM/private IP + port.

## Network path (TGW)

Terraform: `infra/demo/tgw/main.tf`

- ServicesVPC private route tables route `10.50.0.0/16` (EnvsVPC) via TGW
- EnvsVPC private route tables route `10.10.0.0/16` (ServicesVPC) via TGW

Security group: `infra/demo/security/main.tf`

- Env VMs accept inbound **8080** (and 9000–9999) from **ServicesVPC CIDR** (`10.10.0.0/16`)

