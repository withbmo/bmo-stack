resource "aws_route53_zone" "this" {
  name = var.zone_name
  tags = merge(var.tags, { Name = "demo-delegated-zone-${var.zone_name}" })
}

locals {
  use_alb = var.enable_alb_records
}

resource "aws_route53_record" "apex_app_alb" {
  count = local.use_alb ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = var.zone_name
  type    = "A"

  alias {
    name                   = var.app_alb_dns_name
    zone_id                = var.app_alb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api_app_alb" {
  count = local.use_alb ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = "api.${var.zone_name}"
  type    = "A"

  alias {
    name                   = var.app_alb_dns_name
    zone_id                = var.app_alb_zone_id
    evaluate_target_health = true
  }
}
