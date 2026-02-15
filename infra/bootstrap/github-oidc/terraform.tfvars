region      = "us-east-1"
project     = "pytholit"
github_org  = "pytholit"
github_repo = "pytholit"

# Set false only if OIDC provider already exists in this account.
create_oidc_provider = true
# github_oidc_provider_arn = "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"

dev_branch_patterns  = ["main"]
prod_branch_patterns = ["release/*"]

# Start broad, then tighten later.
dev_role_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
prod_role_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
plan_role_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]

tags = {
  Project = "pytholit"
  Stack   = "bootstrap"
}
