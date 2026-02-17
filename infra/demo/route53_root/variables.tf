variable "zone_name" {
  type        = string
  description = "Public DNS zone name (e.g. pytholit.dev)."
}

variable "tags" {
  type    = map(string)
  default = {}
}

