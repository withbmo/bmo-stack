locals {
  required_dns_records = [
    {
      type  = "A"
      name  = var.app_domain_name
      value = aws_eip.this.public_ip
      note  = "Edge proxy app root"
    },
    {
      type  = "A"
      name  = "api.${var.app_domain_name}"
      value = aws_eip.this.public_ip
      note  = "Edge proxy API"
    },
    {
      type  = "A"
      name  = "terminal.${var.app_domain_name}"
      value = aws_eip.this.public_ip
      note  = "Edge proxy terminal"
    },
    {
      type  = "A"
      name  = "*.dev.${var.domain_name}"
      value = aws_eip.this.public_ip
      note  = "Edge proxy dev wildcard"
    },
    {
      type  = "A"
      name  = "*.prod.${var.domain_name}"
      value = aws_eip.this.public_ip
      note  = "Edge proxy prod wildcard"
    }
  ]
}

output "instance_id" {
  value = aws_instance.this.id
}

output "public_ip" {
  value = aws_eip.this.public_ip
}

output "required_dns_records" {
  value = local.required_dns_records
}
