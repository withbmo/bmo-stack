output "external_dns_records_required" {
  value = concat(
    try(module.dns_acm[0].required_dns_records, []),
    local.delegated_dns_enabled ? [] : try(module.edge_proxy[0].required_dns_records, [])
  )
}

output "services_vpc_id" {
  value = module.servicesvpc.vpc_id
}

output "envs_vpc_id" {
  value = module.envsvpc.vpc_id
}

output "tgw_id" {
  value = module.tgw.transit_gateway_id
}

output "env_routing_table_name" {
  value = module.dynamodb.table_name
}

output "env_launch_template_id" {
  value = module.compute.launch_template_id
}

output "jwt_secret_arn" {
  value = module.secrets.jwt_secret_arn
}

output "env_session_secret_arn" {
  value = module.secrets.env_session_secret_arn
}

output "postgres_endpoints" {
  value = module.postgres.endpoints
}

output "postgres_ports" {
  value = module.postgres.ports
}

output "postgres_master_secret_arns" {
  value = module.postgres.master_secret_arns
}

output "app_alb_dns_name" {
  value = try(module.alb_app[0].alb_dns_name, null)
}

output "edge_proxy_public_ip" {
  value = try(module.edge_proxy[0].public_ip, null)
}

output "delegated_zone_name" {
  value = try(module.route53_delegated[0].zone_name, null)
}

output "delegated_zone_name_servers" {
  value = try(module.route53_delegated[0].name_servers, [])
}

output "delegation_record_for_godaddy" {
  value = local.delegated_dns_enabled ? {
    type   = "NS"
    host   = local.delegated_dns_host_label
    values = try(module.route53_delegated[0].name_servers, [])
    note   = "Create this once in GoDaddy under the parent domain to delegate DNS control to Route53"
  } : null
}

output "env_alb_dns_name" {
  value = try(module.alb_env[0].alb_dns_name, null)
}

output "acm_app_certificate_arn" {
  value = try(module.dns_acm[0].app_certificate_arn, null)
}

output "acm_env_certificate_arn" {
  value = try(module.dns_acm[0].env_certificate_arn, null)
}

output "next_steps" {
  value = [
    "1) If ALB/DNS is enabled, create required DNS records in GoDaddy from external_dns_records_required output",
    "2) Build and push images using scripts/build-and-push-demo-images.sh",
    "3) Re-apply with final image tags"
  ]
}
