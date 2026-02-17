resource "aws_acm_certificate" "app" {
  domain_name = var.app_domain_name
  # Cover api/terminal and env hosts in the delegated app subdomain.
  subject_alternative_names = ["*.${var.app_domain_name}"]
  validation_method         = "DNS"

  tags = merge(var.tags, { Name = "demo-app-cert" })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "env" {
  count = var.issue_env_wildcard_certificate ? 1 : 0

  domain_name       = "*.${var.app_domain_name}"
  validation_method = "DNS"

  tags = merge(var.tags, { Name = "demo-env-cert" })

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  use_route53_validation    = var.validation_route53_zone_id != null && var.validation_route53_zone_id != ""
  manage_validation_records = local.use_route53_validation && var.manage_validation_records

  app_validation_records_by_domain = {
    for dvo in aws_acm_certificate.app.domain_validation_options :
    dvo.domain_name => {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
      note  = "ACM app certificate validation"
    }
  }

  env_validation_records_by_domain = {
    for dvo in try(aws_acm_certificate.env[0].domain_validation_options, []) :
    dvo.domain_name => {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
      note  = "ACM env certificate validation"
    }
  }

  validation_records_by_domain = merge(
    local.app_validation_records_by_domain,
    local.env_validation_records_by_domain
  )

  app_validation_records = values(local.app_validation_records_by_domain)
  env_validation_records = values(local.env_validation_records_by_domain)
}

resource "aws_route53_record" "acm_validation" {
  for_each = local.manage_validation_records ? local.validation_records_by_domain : {}

  zone_id = var.validation_route53_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.value]

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "app" {
  count = local.manage_validation_records ? 1 : 0

  certificate_arn         = aws_acm_certificate.app.arn
  validation_record_fqdns = distinct([for r in values(aws_route53_record.acm_validation) : r.fqdn])
}

resource "aws_acm_certificate_validation" "env" {
  count = local.manage_validation_records && var.issue_env_wildcard_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.env[0].arn
  validation_record_fqdns = distinct([for r in values(aws_route53_record.acm_validation) : r.fqdn])
}
