variable "cluster_arn" { type = string }
variable "cluster_name" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "security_group_id" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }
variable "jwt_secret_arn" {
  type    = string
  default = null
}
variable "env_session_secret_arn" {
  type    = string
  default = null
}
variable "db_host" {
  type    = string
  default = null
}
variable "db_port" {
  type    = number
  default = 5432
}
variable "db_name" {
  type    = string
  default = null
}
variable "db_credentials_secret_arn" {
  type    = string
  default = null
}
variable "target_group_arn" {
  type    = string
  default = null
}
variable "enable_load_balancer" {
  type    = bool
  default = true
}
variable "image" {
  type    = string
  default = "public.ecr.aws/docker/library/nginx:stable"
}
variable "desired_count" {
  type    = number
  default = 2
}
variable "tags" {
  type    = map(string)
  default = {}
}
