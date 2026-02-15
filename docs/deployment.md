# Deployment

This repo has two “deployment” axes:

1) **Application deployment** (containers to ECS in the demo stack)
2) **Infrastructure deployment** (Terraform under `infra/`)

## Demo stack (recommended starting point)

- **Workflow**: `.github/workflows/deploy-demo.yml`
- **Terraform root**: `infra/demo/`

See:

- `docs/demo/deploy.md` (end-to-end CI deploy, required AWS bootstrap, required secrets)
- `docs/demo/terraform.md` (Terraform modules/variables/outputs)

## Bootstrap requirements

The demo workflow assumes an S3 backend + DynamoDB locks for Terraform state.

- Remote state: `infra/bootstrap/` (S3 bucket + DynamoDB lock table)
- GitHub OIDC roles: `infra/bootstrap/github-oidc/` (roles for dev/prod deploy + plan)

Both are documented in `docs/demo/deploy.md`.

