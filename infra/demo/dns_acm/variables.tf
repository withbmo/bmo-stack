variable "app_domain_name" {
  type = string
}

variable "app_alb_dns_name" {
  type = string
}

variable "env_alb_dns_name" {
  type = string
}

variable "validation_route53_zone_id" {
  type        = string
  default     = null
  description = "If set, create DNS validation records in this Route53 zone and wait for ACM issuance."
}

variable "issue_env_wildcard_certificate" {
  type        = bool
  default     = true
  description = "If true, issue a wildcard cert for *.<app_domain_name> (dev env hosts)."
}

variable "tags" {
  type    = map(string)
  default = {}
}
