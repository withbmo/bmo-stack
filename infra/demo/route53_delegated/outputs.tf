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
      type  = "A"
      name  = var.zone_name
      value = var.edge_public_ip
      note  = "App root via edge proxy"
    },
    {
      type  = "A"
      name  = "api.${var.zone_name}"
      value = var.edge_public_ip
      note  = "API via edge proxy"
    },
    {
      type  = "A"
      name  = "terminal.${var.zone_name}"
      value = var.edge_public_ip
      note  = "Terminal via edge proxy"
    },
    {
      type  = "A"
      name  = "*.${var.zone_name}"
      value = var.edge_public_ip
      note  = "Wildcard env routes via edge proxy"
    }
  ]
}
