# GitHub OIDC Roles (one-time bootstrap)

Creates IAM roles for GitHub Actions with OIDC trust for:
- dev deploy (`main`)
- prod deploy (`release/*`)
- terraform plan (`main`, `release/*`, and PRs)

## Files
- `providers.tf`
- `variables.tf`
- `main.tf`
- `outputs.tf`
- `terraform.tfvars.example`

## Usage
```bash
cd infra/bootstrap/github-oidc
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform apply
```

## After apply
Copy output values into GitHub repository secrets:
- `AWS_ROLE_TO_ASSUME_DEV`
- `AWS_ROLE_TO_ASSUME_PROD`
- `AWS_ROLE_TO_ASSUME`

You can print them with:
```bash
terraform output github_actions_secret_values
```

## Notes
- Defaults attach `AdministratorAccess` for speed. Replace with least-privilege policies after initial bootstrap.
- If your AWS account already has GitHub OIDC provider, set `create_oidc_provider=false` and provide `github_oidc_provider_arn`.
