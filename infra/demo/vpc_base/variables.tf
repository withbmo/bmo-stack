variable "name_prefix" {
  type        = string
  description = "Prefix used for naming/tagging resources (e.g. services, envs)."
}

variable "vpc_cidr" {
  type = string
}

variable "region" {
  type = string
}

variable "interface_endpoint_services" {
  type        = list(string)
  description = "Full interface endpoint service names (e.g. com.amazonaws.us-east-1.ssm)."
  default     = []
}

variable "tags" {
  type    = map(string)
  default = {}
}

