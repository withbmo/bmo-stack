output "zone_id" {
  value = aws_route53_zone.this.zone_id
}

output "zone_name" {
  value = aws_route53_zone.this.name
}

output "name_servers" {
  value = aws_route53_zone.this.name_servers
}

output "managed_records" {
  value = [
    {
      type  = "A(ALIAS)"
      name  = var.zone_name
      value = var.app_alb_dns_name
      note  = "App root via ALB"
    },
    {
      type  = "A(ALIAS)"
      name  = "api.${var.zone_name}"
      value = var.app_alb_dns_name
      note  = "API via ALB"
    },
  ]
}
