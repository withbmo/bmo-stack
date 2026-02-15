output "app_certificate_arn" {
  value = aws_acm_certificate.app.arn
}

output "env_certificate_arn" {
  value = var.issue_env_wildcard_certificate ? aws_acm_certificate.env[0].arn : null
}

output "required_dns_records" {
  value = local.use_route53_validation ? [] : concat(
    [
      {
        type  = "CNAME"
        name  = var.app_domain_name
        value = var.app_alb_dns_name
        note  = "App root"
      },
      {
        type  = "CNAME"
        name  = "api.${var.app_domain_name}"
        value = var.app_alb_dns_name
        note  = "API"
      },
      {
        type  = "CNAME"
        name  = "terminal.${var.app_domain_name}"
        value = var.app_alb_dns_name
        note  = "Terminal"
      },
      {
        type  = "CNAME"
        name  = "*.${var.app_domain_name}"
        value = var.env_alb_dns_name
        note  = "Dev wildcard"
      },
    ],
    local.app_validation_records,
    local.env_validation_records
  )
}
