resource "aws_route53_zone" "this" {
  name = var.zone_name
  tags = merge(var.tags, { Name = "demo-delegated-zone-${var.zone_name}" })
}

locals {
  edge_enabled = var.edge_public_ip != null && var.edge_public_ip != ""
}

resource "aws_route53_record" "apex_edge" {
  count = local.edge_enabled ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = var.zone_name
  type    = "A"
  ttl     = 60
  records = [var.edge_public_ip]
}

resource "aws_route53_record" "api_edge" {
  count = local.edge_enabled ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = "api.${var.zone_name}"
  type    = "A"
  ttl     = 60
  records = [var.edge_public_ip]
}

resource "aws_route53_record" "terminal_edge" {
  count = local.edge_enabled ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = "terminal.${var.zone_name}"
  type    = "A"
  ttl     = 60
  records = [var.edge_public_ip]
}

resource "aws_route53_record" "wildcard_edge" {
  count = local.edge_enabled ? 1 : 0

  zone_id = aws_route53_zone.this.zone_id
  name    = "*.${var.zone_name}"
  type    = "A"
  ttl     = 60
  records = [var.edge_public_ip]
}
