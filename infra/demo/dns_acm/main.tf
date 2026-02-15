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
  app_validation_records = [
    for dvo in aws_acm_certificate.app.domain_validation_options : {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
      note  = "ACM app certificate validation"
    }
  ]

  env_validation_records = [
    for dvo in try(aws_acm_certificate.env[0].domain_validation_options, []) : {
      type  = dvo.resource_record_type
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
      note  = "ACM env certificate validation"
    }
  ]

  all_validation_records = concat(local.app_validation_records, local.env_validation_records)
  use_route53_validation = var.validation_route53_zone_id != null && var.validation_route53_zone_id != ""

  # App + env wildcard certs can produce the same DNS validation record (same name/type/value).
  # Key by record identity so we only manage each record set once.
  validation_records_grouped = {
    for r in local.all_validation_records :
    "${r.type}:${r.name}" => {
      type  = r.type
      name  = r.name
      value = r.value
    }...
  }

  validation_records_by_key = {
    for k, v in local.validation_records_grouped :
    k => v[0]
  }

  app_validation_keys = [
    for dvo in aws_acm_certificate.app.domain_validation_options :
    "${dvo.resource_record_type}:${dvo.resource_record_name}"
  ]

  env_validation_keys = [
    for dvo in try(aws_acm_certificate.env[0].domain_validation_options, []) :
    "${dvo.resource_record_type}:${dvo.resource_record_name}"
  ]
}

resource "aws_route53_record" "acm_validation" {
  for_each = local.use_route53_validation ? local.validation_records_by_key : {}

  zone_id = var.validation_route53_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.value]

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "app" {
  count = local.use_route53_validation ? 1 : 0

  certificate_arn         = aws_acm_certificate.app.arn
  validation_record_fqdns = [for k in local.app_validation_keys : aws_route53_record.acm_validation[k].fqdn]
}

resource "aws_acm_certificate_validation" "env" {
  count = local.use_route53_validation && var.issue_env_wildcard_certificate ? 1 : 0

  certificate_arn         = aws_acm_certificate.env[0].arn
  validation_record_fqdns = [for k in local.env_validation_keys : aws_route53_record.acm_validation[k].fqdn]
}
