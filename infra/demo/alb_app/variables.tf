variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "alb_security_group_id" {
  type = string
}

variable "app_domain_name" {
  type = string
}

variable "certificate_arn" {
  type    = string
  default = null
}

variable "enable_https" {
  type        = bool
  default     = false
  description = "Create HTTPS listener (certificate_arn may still be unknown at plan time)."
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "enable_lago" {
  type        = bool
  default     = false
  description = "Create Lago target group and listener rules."
}

variable "alarm_actions" {
  type        = list(string)
  default     = []
  description = "Optional CloudWatch alarm action ARNs (e.g. SNS topic ARN)."
}
