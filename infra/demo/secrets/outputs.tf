output "jwt_secret_arn" {
  value = aws_secretsmanager_secret.jwt_secret.arn
}

output "env_session_secret_arn" {
  value = aws_secretsmanager_secret.env_session_secret.arn
}

output "turnstile_secret_dev_arn" {
  value       = aws_secretsmanager_secret.turnstile_secret_dev.arn
  description = "ARN of Turnstile secret key for dev"
}

output "turnstile_site_key_dev_arn" {
  value       = aws_secretsmanager_secret.turnstile_site_key_dev.arn
  description = "ARN of Turnstile site key for dev"
}

output "turnstile_secret_prod_arn" {
  value       = aws_secretsmanager_secret.turnstile_secret_prod.arn
  description = "ARN of Turnstile secret key for prod"
}

output "turnstile_site_key_prod_arn" {
  value       = aws_secretsmanager_secret.turnstile_site_key_prod.arn
  description = "ARN of Turnstile site key for prod"
}
