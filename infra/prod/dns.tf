data "aws_route53_zone" "root" {
  count = var.manage_root_dns && length(trimspace(var.route53_zone_id)) == 0 ? 1 : 0

  name         = "${trimspace(var.domain_name)}."
  private_zone = false
}

locals {
  route53_zone_id_effective = var.manage_root_dns ? (
    length(trimspace(var.route53_zone_id)) > 0 ? trimspace(var.route53_zone_id) : data.aws_route53_zone.root[0].zone_id
  ) : ""
}

resource "aws_route53_record" "web" {
  count = var.manage_root_dns ? 1 : 0

  zone_id = local.route53_zone_id_effective
  name    = local.web_host
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api" {
  count = var.manage_root_dns && var.routing_mode == "host" ? 1 : 0

  zone_id = local.route53_zone_id_effective
  name    = local.api_host
  type    = "A"

  alias {
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
    evaluate_target_health = true
  }
}
