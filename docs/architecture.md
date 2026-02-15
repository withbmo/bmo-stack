# Architecture

## Monorepo layout

The repo is a pnpm + Turborepo monorepo:

- `apps/web`: Next.js frontend
- `apps/api`: NestJS backend (owns auth + user environment APIs)
- `apps/ingress-router`: Fastify service intended to route env traffic to the right VM
- `apps/env-orchestrator`: Fastify service intended to create/stop/terminate env VMs (currently stubbed)
- `apps/terminal-gateway`: Fastify WebSocket service intended to bridge terminal sessions (currently stubbed)
- `packages/db`: Prisma schema + generated client (Postgres)
- `infra/demo`: Terraform for the AWS demo platform (VPCs, ECS, etc.)
- `infra/bootstrap`: Terraform to create remote state bucket + lock table
- `infra/bootstrap/github-oidc`: Terraform to create GitHub Actions OIDC roles

## Demo platform architecture (AWS)

The demo stack in `infra/demo/` provisions:

- **Services VPC** (`10.10.0.0/16`): ECS Fargate services + optional public ALBs + RDS
- **Envs VPC** (`10.50.0.0/16`): per-environment EC2 VMs (Ubuntu 22.04) created from a Launch Template
- **Transit Gateway (TGW)**: private routing between ServicesVPC and EnvsVPC
- **DynamoDB**: `EnvRouting` table for host → env mapping (planned for ingress-router)

See `docs/demo/overview.md` for the detailed traffic and control-plane flows.

