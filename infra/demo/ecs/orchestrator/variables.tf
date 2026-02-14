variable "cluster_arn" { type = string }
variable "cluster_name" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "security_group_id" { type = string }
variable "execution_role_arn" { type = string }
variable "task_role_arn" { type = string }
variable "image" {
  type    = string
  default = "public.ecr.aws/docker/library/nginx:stable"
}
variable "desired_count" {
  type    = number
  default = 1
}
variable "tags" {
  type    = map(string)
  default = {}
}
