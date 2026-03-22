output "app_certificate_arn" {
  value = aws_acm_certificate.app.arn
}

output "env_certificate_arn" {
  value = var.issue_env_wildcard_certificate ? aws_acm_certificate.env[0].arn : null
}

output "required_dns_records" {
  value = local.manage_validation_records ? [] : concat(local.app_validation_records, local.env_validation_records)
}
