resource "random_password" "jwt_secret" {
  length  = 64
  special = true
}

resource "random_password" "env_session_secret" {
  length  = 64
  special = true
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${var.project_name}/api/jwt-secret"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-jwt-secret" })
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = random_password.jwt_secret.result
}

resource "aws_secretsmanager_secret" "env_session_secret" {
  name                    = "${var.project_name}/platform/env-session-secret"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-env-session-secret" })
}

resource "aws_secretsmanager_secret_version" "env_session_secret" {
  secret_id     = aws_secretsmanager_secret.env_session_secret.id
  secret_string = random_password.env_session_secret.result
}

# Turnstile Dev Secrets (values managed externally via AWS CLI)
resource "aws_secretsmanager_secret" "turnstile_secret_dev" {
  name                    = "${var.project_name}/api/turnstile-secret-dev"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-secret-dev" })
}

resource "aws_secretsmanager_secret" "turnstile_site_key_dev" {
  name                    = "${var.project_name}/web/turnstile-site-key-dev"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-site-key-dev" })
}

# Turnstile Prod Secrets (values managed externally via AWS CLI)
resource "aws_secretsmanager_secret" "turnstile_secret_prod" {
  name                    = "${var.project_name}/api/turnstile-secret-prod"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-secret-prod" })
}

resource "aws_secretsmanager_secret" "turnstile_site_key_prod" {
  name                    = "${var.project_name}/web/turnstile-site-key-prod"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-site-key-prod" })
}
