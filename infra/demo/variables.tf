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
  description = "Optional prefix for app/api/terminal hostnames. Example: dev => dev.pytholit.dev"
}

variable "public_zone_managed_externally" {
  type    = bool
  default = true
}

variable "enable_alb" {
  type    = bool
  default = false
}

variable "enable_edge_proxy_when_no_alb" {
  type    = bool
  default = true
}

variable "enable_dns_acm" {
  type    = bool
  default = false
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
    web              = string
    api              = string
    terminal_gateway = string
    ingress_router   = string
    orchestrator     = string
  })

  default = {
    web              = "public.ecr.aws/docker/library/nginx:stable"
    api              = "public.ecr.aws/docker/library/nginx:stable"
    terminal_gateway = "public.ecr.aws/docker/library/nginx:stable"
    ingress_router   = "public.ecr.aws/docker/library/nginx:stable"
    orchestrator     = "public.ecr.aws/docker/library/nginx:stable"
  }
}
