output "supabase_runtime_secret_arn" {
  value       = aws_secretsmanager_secret.supabase_runtime.arn
  description = "ARN of the production Supabase runtime database secret"
}

output "supabase_runtime_secret_name" {
  value       = aws_secretsmanager_secret.supabase_runtime.name
  description = "Name of the production Supabase runtime database secret"
}

output "supabase_direct_secret_arn" {
  value       = aws_secretsmanager_secret.supabase_direct.arn
  description = "ARN of the optional production Supabase direct migration secret"
}

output "supabase_direct_secret_name" {
  value       = aws_secretsmanager_secret.supabase_direct.name
  description = "Name of the optional production Supabase direct migration secret"
}

output "api_runtime_secret_arn" {
  value       = aws_secretsmanager_secret.api_runtime.arn
  description = "ARN of the API runtime secrets placeholder"
}

output "api_runtime_secret_name" {
  value       = aws_secretsmanager_secret.api_runtime.name
  description = "Name of the API runtime secrets placeholder"
}

output "alb_dns_name" {
  value       = aws_lb.this.dns_name
  description = "Public DNS name of the application ALB"
}

output "alb_zone_id" {
  value       = aws_lb.this.zone_id
  description = "Hosted zone id for ALB alias records"
}

output "web_url" {
  value       = local.web_host != "" ? "${var.enable_https ? "https" : "http"}://${local.web_host}" : local.alb_base
  description = "Web base URL when domain_name is configured"
}

output "api_url" {
  value       = local.api_url
  description = "API base URL derived from routing_mode and domain_name"
}

output "vpc_id" {
  value       = aws_vpc.this.id
  description = "VPC id"
}

output "public_subnet_ids" {
  value       = [for az in local.azs : aws_subnet.public[az].id]
  description = "Public subnet ids"
}

output "private_subnet_ids" {
  value       = [for az in local.azs : aws_subnet.private[az].id]
  description = "Private subnet ids"
}

output "ecr_web_repository_url" {
  value       = var.create_ecr_repositories ? aws_ecr_repository.web[0].repository_url : ""
  description = "ECR repository URL for the web image (when create_ecr_repositories=true)"
}

output "ecr_api_repository_url" {
  value       = var.create_ecr_repositories ? aws_ecr_repository.api[0].repository_url : ""
  description = "ECR repository URL for the api image (when create_ecr_repositories=true)"
}
