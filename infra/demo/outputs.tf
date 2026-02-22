output "external_dns_records_required" {
  value = concat(
    try(module.dns_acm[0].required_dns_records, [])
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
  value = {
    dev  = module.secrets.db_dev_secret_arn
    prod = module.secrets.db_prod_secret_arn
  }
  description = "ARNs of PostgreSQL master credential secrets"
}

output "redis_endpoint" {
  value       = module.elasticache.redis_endpoint
  description = "ElastiCache Redis primary endpoint"
}

output "redis_url" {
  value       = module.elasticache.redis_url
  description = "Full Redis connection URL"
}

output "app_alb_dns_name" {
  value = try(module.alb_app[0].alb_dns_name, null)
}

output "delegated_zone_name" {
  value = try(module.route53_delegated[0].zone_name, null)
}

output "delegated_zone_name_servers" {
  value = try(module.route53_delegated[0].name_servers, [])
}

output "root_zone_name" {
  value = try(module.route53_root[0].zone_name, null)
}

output "root_zone_name_servers" {
  value = try(module.route53_root[0].name_servers, [])
}

output "delegation_record_for_godaddy" {
  value = local.delegated_dns_enabled ? {
    type   = "NS"
    host   = local.delegated_dns_host_label
    values = try(module.route53_delegated[0].name_servers, [])
    note   = "Create this once in GoDaddy under the parent domain to delegate DNS control to Route53"
  } : null
}

output "nameservers_for_godaddy_root_domain" {
  value = var.manage_root_dns ? {
    host   = var.domain_name
    values = try(module.route53_root[0].name_servers, [])
    note   = "Set these as the authoritative nameservers for the domain in GoDaddy (domain-level nameserver change)."
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
    "1) If manage_root_dns=true, update the domain-level nameservers in GoDaddy using nameservers_for_godaddy_root_domain output (one-time)",
    "2) Otherwise (delegated subdomain), create required delegation record in GoDaddy from delegation_record_for_godaddy output (one-time)",
    "3) If ALB/DNS is enabled and Route53 validation is disabled, create required DNS records in GoDaddy from external_dns_records_required output",
    "2) Build and push images using scripts/build-and-push-demo-images.sh",
    "3) Re-apply with final image tags"
  ]
}

output "lago_api_service_name" {
  value       = var.enable_lago ? module.ecs_lago[0].api_service_name : null
  description = "ECS service name for Lago API."
}

output "lago_worker_service_name" {
  value       = var.enable_lago ? module.ecs_lago[0].worker_service_name : null
  description = "ECS service name for Lago worker."
}

output "lago_front_service_name" {
  value       = var.enable_lago ? module.ecs_lago[0].front_service_name : null
  description = "ECS service name for Lago front (if enabled)."
}

output "lago_unhealthy_targets_alarm_arn" {
  value       = var.enable_lago ? module.alb_app[0].lago_unhealthy_targets_alarm_arn : null
  description = "CloudWatch alarm ARN for Lago unhealthy targets."
}

output "lago_alb_5xx_alarm_arn" {
  value       = var.enable_lago ? module.alb_app[0].lago_alb_5xx_alarm_arn : null
  description = "CloudWatch alarm ARN for Lago target 5xx errors."
}
