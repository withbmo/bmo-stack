output "record_names" {
  value = [
    aws_route53_record.app[0].fqdn,
    aws_route53_record.api[0].fqdn,
    aws_route53_record.terminal[0].fqdn,
    aws_route53_record.env_wildcard[0].fqdn,
  ]
}

