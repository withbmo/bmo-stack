variable "project_name" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "db_master_username" {
  type        = string
  default     = "pytholit_admin"
  description = "Master username for PostgreSQL databases"
}
