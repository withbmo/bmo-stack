variable "services_vpc_id" {
  type = string
}

variable "envs_vpc_id" {
  type = string
}

variable "services_private_subnet_ids" {
  type = list(string)
}

variable "envs_private_subnet_ids" {
  type = list(string)
}

variable "services_private_route_table_ids" {
  type = list(string)
}

variable "envs_private_route_table_ids" {
  type = list(string)
}

variable "services_vpc_cidr" {
  type = string
}

variable "envs_vpc_cidr" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
