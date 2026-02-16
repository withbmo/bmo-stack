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
  description             = "JWT signing secret for API authentication tokens"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-jwt-secret" })
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = random_password.jwt_secret.result
}

resource "aws_secretsmanager_secret" "env_session_secret" {
  name                    = "${var.project_name}/platform/env-session-secret"
  description             = "Session secret for platform environment management"
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
  description             = "Cloudflare Turnstile secret key for dev environment bot protection"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-secret-dev" })
}

resource "aws_secretsmanager_secret" "turnstile_site_key_dev" {
  name                    = "${var.project_name}/web/turnstile-site-key-dev"
  description             = "Cloudflare Turnstile site key for dev environment (public)"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-site-key-dev" })
}

# Turnstile Prod Secrets (values managed externally via AWS CLI)
resource "aws_secretsmanager_secret" "turnstile_secret_prod" {
  name                    = "${var.project_name}/api/turnstile-secret-prod"
  description             = "Cloudflare Turnstile secret key for production environment bot protection"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-secret-prod" })
}

resource "aws_secretsmanager_secret" "turnstile_site_key_prod" {
  name                    = "${var.project_name}/web/turnstile-site-key-prod"
  description             = "Cloudflare Turnstile site key for production environment (public)"
  recovery_window_in_days = 0
  tags                    = merge(var.tags, { Name = "demo-turnstile-site-key-prod" })
}

# ==============================================================================
# ZeptoMail API Secret
# ==============================================================================
# Note: Secret value must be populated manually via AWS CLI after creation
# Command: aws secretsmanager put-secret-value --secret-id pytholit-demo/api/zeptomail-api-key --secret-string "Zoho-enczapikey YOUR_KEY"

resource "aws_secretsmanager_secret" "zeptomail_api_key" {
  name                    = "${var.project_name}/api/zeptomail-api-key"
  description             = "ZeptoMail API key for transactional email service"
  recovery_window_in_days = 0

  tags = merge(var.tags, {
    Name      = "${var.project_name}-zeptomail-api-key"
    Service   = "email"
    ManagedBy = "terraform"
  })
}

# ==============================================================================
# Database Secrets
# ==============================================================================
# PostgreSQL master passwords for dev and prod databases

resource "random_password" "db_dev_password" {
  length  = 32
  special = true
}

resource "random_password" "db_prod_password" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "db_dev" {
  name                    = "${var.project_name}/db/dev-postgres"
  description             = "PostgreSQL master credentials for development database"
  recovery_window_in_days = 0

  tags = merge(var.tags, {
    Name        = "${var.project_name}-db-dev"
    Environment = "dev"
    Service     = "database"
    ManagedBy   = "terraform"
  })
}

resource "aws_secretsmanager_secret_version" "db_dev" {
  secret_id = aws_secretsmanager_secret.db_dev.id
  secret_string = jsonencode({
    username = var.db_master_username
    password = random_password.db_dev_password.result
  })
}

resource "aws_secretsmanager_secret" "db_prod" {
  name                    = "${var.project_name}/db/prod-postgres"
  description             = "PostgreSQL master credentials for production database"
  recovery_window_in_days = 0

  tags = merge(var.tags, {
    Name        = "${var.project_name}-db-prod"
    Environment = "prod"
    Service     = "database"
    ManagedBy   = "terraform"
  })
}

resource "aws_secretsmanager_secret_version" "db_prod" {
  secret_id = aws_secretsmanager_secret.db_prod.id
  secret_string = jsonencode({
    username = var.db_master_username
    password = random_password.db_prod_password.result
  })
}
