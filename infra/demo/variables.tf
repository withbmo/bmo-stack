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

variable "enable_dns_acm" {
  type    = bool
  default = false
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
