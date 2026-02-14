variable "tags" {
  type    = map(string)
  default = {}
}

variable "secret_arns" {
  type    = list(string)
  default = []
}
