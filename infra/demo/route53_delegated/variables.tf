variable "zone_name" {
  type = string
}

variable "edge_public_ip" {
  type    = string
  default = null
}

variable "tags" {
  type    = map(string)
  default = {}
}
