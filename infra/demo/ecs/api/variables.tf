variable "cluster_arn" { type = string }
variable "cluster_name" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "security_group_id" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }
variable "jwt_secret_arn" {
  type    = string
  default = null
}
variable "env_session_secret_arn" {
  type    = string
  default = null
}
variable "turnstile_secret_arn" {
  type        = string
  default     = null
  description = "ARN of the Turnstile secret key in Secrets Manager"
}
variable "zeptomail_api_key_arn" {
  type        = string
  default     = null
  description = "ARN of the ZeptoMail API key in AWS Secrets Manager"
}
variable "db_host" {
  type    = string
  default = null
}
variable "db_port" {
  type    = number
  default = 5432
}
variable "db_name" {
  type    = string
  default = null
}

variable "frontend_url" {
  type        = string
  default     = null
  description = "Frontend base URL for OAuth redirects (e.g. https://pytholit.dev)"
}

variable "cookie_domain" {
  type        = string
  default     = null
  description = "Cookie domain for cross-subdomain sessions (e.g. .pytholit.dev). Leave null for localhost."
}

variable "upload_dir" {
  type        = string
  default     = "uploads"
  description = "Local upload directory used for avatars and other uploads."
}

variable "node_env" {
  type        = string
  default     = "production"
  description = "NODE_ENV for the API container."
}

variable "app_env" {
  type        = string
  default     = null
  description = "APP_ENV for the API container (localhost|development|production)."
}

variable "redis_url" {
  type        = string
  default     = null
  description = "Optional Redis URL for OAuth state storage."
}

variable "github_client_id_arn" {
  type        = string
  default     = null
  description = "ARN of GitHub OAuth Client ID secret in AWS Secrets Manager"
}

variable "github_client_secret_arn" {
  type        = string
  default     = null
  description = "ARN of GitHub OAuth Client Secret in AWS Secrets Manager"
}

variable "google_client_id_arn" {
  type        = string
  default     = null
  description = "ARN of Google OAuth Client ID secret in AWS Secrets Manager"
}

variable "google_client_secret_arn" {
  type        = string
  default     = null
  description = "ARN of Google OAuth Client Secret in AWS Secrets Manager"
}

variable "db_credentials_secret_arn" {
  type    = string
  default = null
}
variable "target_group_arn" {
  type    = string
  default = null
}
variable "enable_load_balancer" {
  type    = bool
  default = true
}
variable "image" {
  type    = string
  default = "public.ecr.aws/docker/library/nginx:stable"
}
variable "desired_count" {
  type    = number
  default = 1
}
variable "autoscaling_min_capacity" {
  type    = number
  default = 1
}
variable "autoscaling_max_capacity" {
  type    = number
  default = 10
}
variable "tags" {
  type    = map(string)
  default = {}
}

variable "orchestrator_url" {
  type        = string
  default     = ""
  description = "Internal URL of the env-orchestrator service (e.g. http://<private-ip>:3401)."
}

variable "internal_secret" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Shared secret for internal orchestrator → API callbacks."
}
