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

output "zeptomail_api_key_arn" {
  value       = aws_secretsmanager_secret.zeptomail_api_key.arn
  description = "ARN of ZeptoMail API key secret"
}

output "db_dev_secret_arn" {
  value       = aws_secretsmanager_secret.db_dev.arn
  description = "ARN of dev PostgreSQL master credentials secret"
}

output "db_prod_secret_arn" {
  value       = aws_secretsmanager_secret.db_prod.arn
  description = "ARN of prod PostgreSQL master credentials secret"
}

output "db_dev_password" {
  value       = random_password.db_dev_password.result
  description = "Generated password for dev database"
  sensitive   = true
}

output "db_prod_password" {
  value       = random_password.db_prod_password.result
  description = "Generated password for prod database"
  sensitive   = true
}

output "supabase_prod_secret_arn" {
  value       = aws_secretsmanager_secret.supabase_prod.arn
  description = "ARN of the production Supabase runtime DB settings secret"
}

output "supabase_prod_direct_secret_arn" {
  value       = aws_secretsmanager_secret.supabase_prod_direct.arn
  description = "ARN of the production Supabase direct-host migration secret"
}

# ==============================================================================
# GitHub OAuth Secrets (Managed Externally)
# ==============================================================================
output "github_client_id_dev_arn" {
  value       = "arn:aws:secretsmanager:us-east-1:600161850626:secret:pytholit-demo/api/github-client-id-dev-rqgip4"
  description = "ARN of GitHub OAuth Client ID for dev environment"
}

output "github_client_secret_dev_arn" {
  value       = "arn:aws:secretsmanager:us-east-1:600161850626:secret:pytholit-demo/api/github-client-secret-dev-2xaeWV"
  description = "ARN of GitHub OAuth Client Secret for dev environment"
}

output "github_client_id_prod_arn" {
  value       = "arn:aws:secretsmanager:us-east-1:600161850626:secret:pytholit-demo/api/github-client-id-prod-476Eq8"
  description = "ARN of GitHub OAuth Client ID for prod environment"
}

output "github_client_secret_prod_arn" {
  value       = "arn:aws:secretsmanager:us-east-1:600161850626:secret:pytholit-demo/api/github-client-secret-prod-xWElhG"
  description = "ARN of GitHub OAuth Client Secret for prod environment"
}

# ==============================================================================
# Google OAuth Secrets (Shared Strategy - Managed Externally)
# ==============================================================================
output "google_client_id_arn" {
  value       = "arn:aws:secretsmanager:us-east-1:600161850626:secret:pytholit-demo/api/google-client-id-7WZdw1"
  description = "ARN of Google OAuth Client ID (shared across environments)"
}

output "google_client_secret_arn" {
  value       = "arn:aws:secretsmanager:us-east-1:600161850626:secret:pytholit-demo/api/google-client-secret-xAR3qM"
  description = "ARN of Google OAuth Client Secret (shared across environments)"
}
