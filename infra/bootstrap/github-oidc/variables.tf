variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  type    = string
  default = "pytholit"
}

variable "github_org" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "create_oidc_provider" {
  type        = bool
  default     = true
  description = "Create AWS IAM OIDC provider for GitHub Actions. Set false if already created in this account."
}

variable "github_oidc_provider_arn" {
  type        = string
  default     = ""
  description = "Existing GitHub OIDC provider ARN. Required when create_oidc_provider = false."
}

variable "dev_branch_patterns" {
  type    = list(string)
  default = ["main"]
}

variable "prod_branch_patterns" {
  type    = list(string)
  default = ["release/*"]
}

variable "plan_role_include_pull_request" {
  type    = bool
  default = true
}

variable "dev_role_policy_arns" {
  type    = list(string)
  default = ["arn:aws:iam::aws:policy/AdministratorAccess"]
}

variable "prod_role_policy_arns" {
  type    = list(string)
  default = ["arn:aws:iam::aws:policy/AdministratorAccess"]
}

variable "plan_role_policy_arns" {
  type    = list(string)
  default = ["arn:aws:iam::aws:policy/AdministratorAccess"]
}

variable "tags" {
  type    = map(string)
  default = {}
}
