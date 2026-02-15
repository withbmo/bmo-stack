# Demo platform — known gaps / TODOs

This repo has the **infrastructure shape** for per-user environments, but some runtime pieces are intentionally stubbed or not yet wired.

## Control plane (environment provisioning)

- **Orchestrator service is stubbed**
  - App: `apps/env-orchestrator/src/main.ts`
  - Endpoints return static “accepted” responses and do not create/stop EC2 instances.
- **API start/stop/terminate do not call orchestrator**
  - `apps/api/src/environments/environments.service.ts` currently updates `config.orchestrator.status/message` in Postgres only.
  - No AWS-side provisioning occurs from these endpoints today.

## Data plane (env traffic routing)

- **Ingress-router does not forward yet**
  - App: `apps/ingress-router/src/main.ts`
  - It validates proxy tokens and returns a JSON stub.
  - DynamoDB lookup + TGW forwarding are explicitly noted as “next”.
- **EnvRouting table is not populated by app code**
  - Terraform creates DynamoDB `EnvRouting`, but no service writes host → env mappings yet.

## Terminal gateway

- **Terminal gateway currently echoes**
  - App: `apps/terminal-gateway/src/main.ts`
  - It validates a terminal token and echoes messages back.
  - It does not yet bridge to SSM / the env VM.

## Edge (public ALBs + DNS)

- `enable_alb` and `enable_dns_acm` are **false** in both `infra/demo/dev.tfvars` and `infra/demo/prod.tfvars`.
  - Without enabling them, public hostnames will not route to ECS services via ALB.
  - The `dns_acm` module emits DNS records you must create externally (zone is assumed external).

