output "app_certificate_arn" {
  value = aws_acm_certificate.app.arn
}

output "env_certificate_arn" {
  value = aws_acm_certificate.env.arn
}

output "required_dns_records" {
  value = concat(
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
        name  = "*.dev.${var.domain_name}"
        value = var.env_alb_dns_name
        note  = "Dev wildcard"
      },
      {
        type  = "CNAME"
        name  = "*.prod.${var.domain_name}"
        value = var.env_alb_dns_name
        note  = "Prod wildcard"
      }
    ],
    local.app_validation_records,
    local.env_validation_records
  )
}
