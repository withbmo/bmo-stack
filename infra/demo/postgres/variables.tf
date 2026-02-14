variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "ecs_security_group_id" {
  type = string
}

variable "master_username" {
  type    = string
  default = "pytholit_admin"
}

variable "instances" {
  type = map(object({
    instance_class          = string
    allocated_storage       = number
    max_allocated_storage   = number
    backup_retention_period = number
    multi_az                = bool
    deletion_protection     = bool
  }))
}

variable "tags" {
  type    = map(string)
  default = {}
}
