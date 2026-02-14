output "github_oidc_provider_arn" {
  value = local.oidc_provider_arn
}

output "aws_role_to_assume_dev" {
  value = aws_iam_role.dev.arn
}

output "aws_role_to_assume_prod" {
  value = aws_iam_role.prod.arn
}

output "aws_role_to_assume_plan" {
  value = aws_iam_role.plan.arn
}

output "github_actions_secret_values" {
  value = {
    AWS_ROLE_TO_ASSUME_DEV  = aws_iam_role.dev.arn
    AWS_ROLE_TO_ASSUME_PROD = aws_iam_role.prod.arn
    AWS_ROLE_TO_ASSUME      = aws_iam_role.plan.arn
  }
}
