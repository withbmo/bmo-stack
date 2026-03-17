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

variable "storage_driver" {
  type        = string
  default     = "s3"
  description = "Storage driver for uploads: 's3' or 'local'."
}

variable "s3_bucket" {
  type        = string
  default     = ""
  description = "S3 bucket name for avatar storage."
}

variable "s3_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region for the S3 bucket."
}

variable "s3_public_url" {
  type        = string
  default     = ""
  description = "Public base URL for S3 objects (e.g. https://<bucket>.s3.<region>.amazonaws.com)."
}

variable "node_env" {
  type        = string
  default     = "production"
  description = "NODE_ENV for the API container."
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
variable "supabase_db_secret_arn" {
  type    = string
  default = null
}
variable "supabase_direct_db_secret_arn" {
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

variable "internal_secret" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Shared secret for internal orchestrator → API callbacks."
}
