variable "zone_name" {
  type = string
}

variable "app_alb_dns_name" {
  type    = string
  default = null
}

variable "app_alb_zone_id" {
  type    = string
  default = null
}

variable "enable_alb_records" {
  type    = bool
  default = false
}

variable "tags" {
  type    = map(string)
  default = {}
}
