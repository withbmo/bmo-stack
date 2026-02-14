variable "instance_profile_name" {
  type = string
}

variable "security_group_ids" {
  type = list(string)
}

variable "tags" {
  type    = map(string)
  default = {}
}
