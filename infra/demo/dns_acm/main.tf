resource "aws_acm_certificate" "app" {
  domain_name               = var.app_domain_name
  subject_alternative_names = ["api.${var.app_domain_name}", "terminal.${var.app_domain_name}"]
  validation_method         = "DNS"

  tags = merge(var.tags, { Name = "demo-app-cert" })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "env" {
  domain_name               = "*.dev.${var.domain_name}"
  subject_alternative_names = ["*.prod.${var.domain_name}"]
  validation_method         = "DNS"

  tags = merge(var.tags, { Name = "demo-env-cert" })

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  app_validation_records = [
    for dvo in aws_acm_certificate.app.domain_validation_options : {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
      note  = "ACM app certificate validation"
    }
  ]

  env_validation_records = [
    for dvo in aws_acm_certificate.env.domain_validation_options : {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
      note  = "ACM env certificate validation"
    }
  ]
}
