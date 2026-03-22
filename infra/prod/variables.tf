variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "pytholit-prod"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "project_name must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "environment" {
  type    = string
  default = "prod"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.environment))
    error_message = "environment must contain only lowercase letters, numbers, and hyphens."
  }
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "az_count" {
  type        = number
  default     = 3
  description = "How many AZs to span (2-3 recommended)."

  validation {
    condition     = var.az_count >= 2 && var.az_count <= 3
    error_message = "az_count must be 2 or 3."
  }
}

variable "nat_gateway_per_az" {
  type        = bool
  default     = true
  description = "If true, create a NAT gateway per AZ (higher cost, higher resiliency)."
}

variable "routing_mode" {
  type        = string
  default     = "path"
  description = "host (recommended) routes API by hostname; path routes the API by /api/* on the same host."

  validation {
    condition     = contains(["host", "path"], var.routing_mode)
    error_message = "routing_mode must be one of: host, path."
  }
}

variable "domain_name" {
  type        = string
  default     = ""
  description = "Base domain for production hostnames (e.g. pytholit.dev). Required for routing_mode=host."
}

variable "app_domain_prefix" {
  type        = string
  default     = ""
  description = "Optional prefix for the app domain. Example: 'prod' => prod.<domain_name>."
}

variable "manage_root_dns" {
  type        = bool
  default     = false
  description = "If true, create/manage Route53 alias records for web/api/terminal/ingress."
}

variable "route53_zone_id" {
  type        = string
  default     = ""
  description = "Optional Route53 hosted zone id. If empty and manage_root_dns=true, Terraform looks up the zone for domain_name."
}

variable "enable_https" {
  type        = bool
  default     = false
  description = "If true, create an HTTPS listener. Requires certificate_arn."
}

variable "certificate_arn" {
  type        = string
  default     = ""
  description = "ACM certificate ARN for the ALB HTTPS listener."
}

variable "alb_allowed_cidrs" {
  type        = list(string)
  default     = ["0.0.0.0/0"]
  description = "CIDRs allowed to reach the public ALB (80/443)."
}

variable "images" {
  type = object({
    web = string
    api = string
  })

  default = {
    web = "public.ecr.aws/docker/library/nginx:stable"
    api = "public.ecr.aws/docker/library/nginx:stable"
  }
}

variable "create_ecr_repositories" {
  type        = bool
  default     = false
  description = "If true, create ECR repositories for web/api."
}

variable "desired_count" {
  type = object({
    web = number
    api = number
  })

  default = {
    web = 2
    api = 2
  }
}

variable "enable_execute_command" {
  type        = bool
  default     = true
  description = "If true, enable ECS Exec (requires SSM permissions on the task role)."
}

variable "service_cpu" {
  type = object({
    web = number
    api = number
  })

  default = {
    web = 512
    api = 512
  }
}

variable "service_memory" {
  type = object({
    web = number
    api = number
  })

  default = {
    web = 1024
    api = 1024
  }
}

variable "api_env" {
  type        = map(string)
  default     = {}
  description = "Extra non-secret environment variables to set on the API container."
}

variable "web_env" {
  type        = map(string)
  default     = {}
  description = "Extra non-secret environment variables to set on the web container."
}

variable "db_runtime_secret_arn" {
  type        = string
  default     = ""
  description = "Optional Secrets Manager secret ARN containing DB connection fields (host/port/dbname/username/password/sslmode). Defaults to the prod Supabase secret created by this stack."
}

variable "enable_db_direct" {
  type        = bool
  default     = false
  description = "If true, inject DB_DIRECT_HOST/DB_DIRECT_PORT from a secret (useful for Supabase direct-host migrations)."
}

variable "db_direct_secret_arn" {
  type        = string
  default     = ""
  description = "Optional secret ARN containing direct migration host/port fields (host/port). Defaults to the Supabase direct secret created by this stack."
}

variable "api_runtime_secret_arn" {
  type        = string
  default     = ""
  description = "Optional Secrets Manager secret ARN containing API runtime secrets (JWT_SECRET, ENV_SESSION_SECRET, INTERNAL_SECRET, OAuth, SMTP, etc). Defaults to the secret created by this stack."
}
