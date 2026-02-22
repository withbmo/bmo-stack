variable "cluster_arn" { type = string }
variable "cluster_name" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "security_group_id" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }

variable "db_host" { type = string }
variable "db_port" {
  type    = number
  default = 5432
}
variable "db_name" {
  type    = string
  default = "lago"
}
variable "db_user" {
  type    = string
  default = "lago_user"
}
variable "db_password" {
  type      = string
  sensitive = true
}

variable "redis_url" { type = string }

variable "api_url" {
  type        = string
  description = "Public Lago API URL (e.g. https://lago.pytholit.dev)."
}

variable "front_url" {
  type        = string
  default     = ""
  description = "Public Lago front URL (e.g. https://lago.pytholit.dev)."
}

variable "api_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "secret_key_base" {
  type      = string
  sensitive = true
}

variable "stripe_secret_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "api_image" {
  type    = string
  default = "getlago/api:v1.0.0"
}

variable "worker_image" {
  type    = string
  default = "getlago/api:v1.0.0"
}

variable "front_image" {
  type    = string
  default = "getlago/front:v1.0.0"
}

variable "api_desired_count" {
  type    = number
  default = 2
}

variable "worker_desired_count" {
  type    = number
  default = 1
}

variable "enable_front" {
  type    = bool
  default = false
}

variable "front_desired_count" {
  type    = number
  default = 1
}

variable "enable_load_balancer" {
  type    = bool
  default = false
}

variable "api_target_group_arn" {
  type    = string
  default = null
}

variable "tags" {
  type    = map(string)
  default = {}
}
