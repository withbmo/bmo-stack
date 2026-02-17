# Demo deploy (CI + AWS bootstrap)

This doc explains how the demo stack is deployed by GitHub Actions and what AWS-side bootstrapping is required.

## What deploys the demo

Workflow: `.github/workflows/deploy-demo.yml`

It does:

1. Classifies changes and skips deploy when no app/infra changes
2. Builds and pushes container images to ECR (linux/amd64; buildx cache enabled):
   - `web`
   - `api`
   - `ingress-router`
   - `env-orchestrator`
   - `terminal-gateway`
3. Writes `infra/demo/ci-images.auto.tfvars.json` for Terraform (from the new tag, or from currently deployed ECS images when build is skipped)
4. Runs `terraform init` + `terraform apply` in `infra/demo` (authoritative for rollouts)
5. Runs Prisma migrations as a one-off ECS task (via reusable workflow: `.github/workflows/migrate-demo.yml`)
6. Runs post-deploy smoke checks:
   - `GET /api/v1/health` (200)
   - `GET /` on web (200/301/302)
   - `GET /api/v1/users/me` (401 when logged out)

## Required GitHub secrets (for CI)

The workflow assumes GitHub OIDC and requires:

- `AWS_ROLE_TO_ASSUME_DEV`
- `AWS_ROLE_TO_ASSUME_PROD`

These are used by `aws-actions/configure-aws-credentials@v4`.

## AWS bootstrap (one-time)

### 1) Terraform remote state

Stack: `infra/bootstrap/`

Creates:

- S3 bucket for Terraform state (versioned, encrypted, private)
- DynamoDB lock table for state locks

Outputs:

- `state_bucket_name`
- `lock_table_name`

You must then align `infra/demo/backend.tf` with those names (or keep the repo defaults if you created matching resources).

### 2) GitHub Actions OIDC roles

Stack: `infra/bootstrap/github-oidc/`

Creates:

- (optionally) the GitHub OIDC provider in IAM
- IAM roles trusted for:
  - dev deploy (main / environment:dev)
  - prod deploy (release/* / environment:prod)
  - terraform plan (branches and optionally PRs)

After apply, use:

```bash
cd infra/bootstrap/github-oidc
terraform output github_actions_secret_values
```

Then copy values to GitHub Secrets:

- `AWS_ROLE_TO_ASSUME_DEV`
- `AWS_ROLE_TO_ASSUME_PROD`
- (optionally for plan workflows) `AWS_ROLE_TO_ASSUME`

## Deployment environments (dev vs prod)

Workflow behavior:

- `dev` deploy:
  - triggered by pushes to `main` (or manual dispatch selecting dev)
  - uses `AWS_ROLE_TO_ASSUME_DEV`
  - typically uses `infra/demo/dev.tfvars`:
    - `app_domain_prefix="dev"`
    - `api_database_env="dev"`
- `prod` deploy:
  - triggered by pushes to `release/**` (or manual dispatch selecting prod)
  - uses `AWS_ROLE_TO_ASSUME_PROD`
  - typically uses `infra/demo/prod.tfvars`:
    - `app_domain_prefix=""`
    - `api_database_env="prod"`

## DNS / TLS cutover

In Terraform, both `enable_alb` and `enable_dns_acm` default to `false` in `dev.tfvars` and `prod.tfvars`.

To serve real hostnames publicly you need:

- `enable_alb=true` to create ALBs
- `enable_dns_acm=true` to create ACM certs + get `external_dns_records_required`
- Create the required DNS records in your DNS provider (zone is managed externally by default)

## Local alternative: build/push images

Script: `scripts/build-and-push-demo-images.sh`

Builds and pushes the same set of images to ECR (linux/amd64) and prints the pushed tag.
