variable "zone_id" { type = string }

variable "zone_name" {
  type        = string
  description = "Authoritative hosted zone name (e.g. pytholit.dev). Used for apex record convenience."
}

variable "app_domain_name" {
  type        = string
  description = "App domain name (e.g. dev.pytholit.dev)."
}

variable "app_alb_dns_name" {
  type = string
}

variable "app_alb_zone_id" {
  type = string
}

variable "env_alb_dns_name" {
  type = string
}

variable "env_alb_zone_id" {
  type = string
}

variable "enable_alb_records" {
  type    = bool
  default = true
}

variable "extra_txt_records" {
  type = list(object({
    name  = string
    value = string
    ttl   = optional(number)
  }))
  default     = []
  description = "Additional TXT records to create in the zone (useful for email verification/DKIM/SPF)."
}

variable "extra_cname_records" {
  type = list(object({
    name  = string
    value = string
    ttl   = optional(number)
  }))
  default     = []
  description = "Additional CNAME records to create in the zone."
}

variable "extra_mx_records" {
  type = list(object({
    name     = string
    priority = number
    value    = string
    ttl      = optional(number)
  }))
  default     = []
  description = "Additional MX records to create in the zone."
}
