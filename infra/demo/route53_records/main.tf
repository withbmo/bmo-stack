locals {
  use_alb = var.enable_alb_records

  extra_record_name = {
    for name in distinct(concat(
      [for r in var.extra_txt_records : r.name],
      [for r in var.extra_cname_records : r.name],
      [for r in var.extra_mx_records : r.name],
    )) :
    name => (name == "" || name == "@" ? var.zone_name : name)
  }

  txt_value_chunks = {
    for r in var.extra_txt_records :
    r.name => regexall(".{1,255}", r.value)
  }

  txt_record_value = {
    for r in var.extra_txt_records :
    # The AWS provider automatically wraps TXT values in quotes. For long values (e.g. DKIM),
    # we rely on that behavior by inserting quote separators between 255-char chunks without
    # adding leading/trailing quotes ourselves.
    r.name => length(r.value) <= 255 ? r.value : join("\" \"", local.txt_value_chunks[r.name])
  }
}

resource "aws_route53_record" "app" {
  count = local.use_alb ? 1 : 0

  zone_id = var.zone_id
  name    = var.app_domain_name
  type    = "A"

  alias {
    name                   = var.app_alb_dns_name
    zone_id                = var.app_alb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api" {
  count = local.use_alb ? 1 : 0

  zone_id = var.zone_id
  name    = "api.${var.app_domain_name}"
  type    = "A"

  alias {
    name                   = var.app_alb_dns_name
    zone_id                = var.app_alb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "extra_txt" {
  for_each = { for r in var.extra_txt_records : r.name => r }

  zone_id = var.zone_id
  name    = local.extra_record_name[each.value.name]
  type    = "TXT"
  ttl     = coalesce(try(each.value.ttl, null), 300)

  # Route53 TXT character-strings are limited to 255 bytes. For long values (e.g. DKIM),
  # provide a single TXT record value containing multiple quoted chunks.
  records = [local.txt_record_value[each.key]]
}

resource "aws_route53_record" "extra_cname" {
  for_each = { for r in var.extra_cname_records : r.name => r }

  zone_id = var.zone_id
  name    = local.extra_record_name[each.value.name]
  type    = "CNAME"
  ttl     = coalesce(try(each.value.ttl, null), 300)

  records = [
    endswith(each.value.value, ".") ? each.value.value : "${each.value.value}.",
  ]
}

resource "aws_route53_record" "extra_mx" {
  for_each = {
    for name in distinct([for r in var.extra_mx_records : r.name]) :
    name => {
      name = name
      ttl  = coalesce(try(one([for r in var.extra_mx_records : r.ttl if r.name == name]), null), 300)
      rows = [for r in var.extra_mx_records : r if r.name == name]
    }
  }

  zone_id = var.zone_id
  name    = local.extra_record_name[each.value.name]
  type    = "MX"
  ttl     = each.value.ttl

  records = [
    for r in each.value.rows :
    format("%d %s", r.priority, endswith(r.value, ".") ? r.value : "${r.value}.")
  ]
}
