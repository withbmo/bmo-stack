variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "pytholit-prod"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "tags" {
  type    = map(string)
  default = {}
}
