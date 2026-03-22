variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "pytholit-demo"
}

variable "services_vpc_cidr" {
  type    = string
  default = "10.10.0.0/16"
}

variable "envs_vpc_cidr" {
  type    = string
  default = "10.50.0.0/16"
}

variable "domain_name" {
  type    = string
  default = "pytholit.dev"
}

variable "app_domain_prefix" {
  type        = string
  default     = ""
  description = "Optional prefix for app/api hostnames. Example: dev => dev.pytholit.dev"
}

variable "enable_alb" {
  type    = bool
  default = true

  validation {
    condition     = var.enable_alb
    error_message = "enable_alb=false is no longer supported (the edge-proxy fallback was removed)."
  }
}

variable "manage_delegated_dns" {
  type    = bool
  default = true
}

variable "manage_root_dns" {
  type        = bool
  default     = false
  description = "If true, create/manage the Route53 public hosted zone for domain_name and all app/env records inside it (recommended)."
}

variable "enable_dns_acm" {
  type    = bool
  default = true
}

variable "postgres_master_username" {
  type    = string
  default = "pytholit_admin"
}

variable "api_database_env" {
  type        = string
  default     = "dev"
  description = "Which postgres instance the API should use (dev|prod)"

  validation {
    condition     = contains(["dev", "prod"], var.api_database_env)
    error_message = "api_database_env must be one of: dev, prod."
  }
}

variable "api_database_provider" {
  type        = string
  default     = "rds"
  description = "Which database provider the API should use in AWS environments (rds|supabase)."

  validation {
    condition     = contains(["rds", "supabase"], var.api_database_provider)
    error_message = "api_database_provider must be one of: rds, supabase."
  }
}

variable "api_supabase_direct_url_enabled" {
  type        = bool
  default     = false
  description = "Whether to inject DB_DIRECT_HOST and DB_DIRECT_PORT for production Supabase migrations. Enable only when the direct host is reachable from ECS."
}

variable "postgres_instances" {
  type = map(object({
    instance_class          = string
    allocated_storage       = number
    max_allocated_storage   = number
    backup_retention_period = number
    multi_az                = bool
    deletion_protection     = bool
  }))

  default = {
    dev = {
      instance_class          = "db.t4g.micro"
      allocated_storage       = 20
      max_allocated_storage   = 100
      backup_retention_period = 1
      multi_az                = false
      deletion_protection     = false
    }
    prod = {
      instance_class          = "db.t4g.micro"
      allocated_storage       = 20
      max_allocated_storage   = 100
      backup_retention_period = 1
      multi_az                = false
      deletion_protection     = false
    }
  }
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

variable "route53_extra_txt_records" {
  type = list(object({
    name  = string
    value = string
    ttl   = optional(number)
  }))
  default     = []
  description = "Extra TXT records to manage in the (root) Route53 zone (e.g. ZeptoMail DKIM/SPF/verification)."
}

variable "route53_extra_cname_records" {
  type = list(object({
    name  = string
    value = string
    ttl   = optional(number)
  }))
  default     = []
  description = "Extra CNAME records to manage in the (root) Route53 zone (e.g. ZeptoMail bounce/return-path)."
}

variable "orchestrator_internal_secret" {
  type        = string
  default     = ""
  sensitive   = true
  description = "Shared secret used to authenticate orchestrator → API internal callbacks."
}

variable "env_domain_suffix" {
  type        = string
  default     = "envs.pytholit.dev"
  description = "Domain suffix for environment routing entries (e.g. <envId>.envs.pytholit.dev)."
}

variable "route53_extra_mx_records" {
  type = list(object({
    name     = string
    priority = number
    value    = string
    ttl      = optional(number)
  }))
  default     = []
  description = "Extra MX records to manage in the (root) Route53 zone (e.g. Zoho inbound mail)."
}
