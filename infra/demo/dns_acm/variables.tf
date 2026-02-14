variable "domain_name" {
  type = string
}

variable "app_domain_name" {
  type = string
}

variable "app_alb_dns_name" {
  type = string
}

variable "env_alb_dns_name" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "public_zone_managed_externally" {
  type    = bool
  default = true
}
