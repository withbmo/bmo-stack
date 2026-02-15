variable "services_vpc_id" {
  type = string
}

variable "envs_vpc_id" {
  type = string
}

variable "services_vpc_cidr" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "edge_proxy_enabled" {
  type    = bool
  default = false
}
