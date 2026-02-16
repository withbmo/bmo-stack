output "redis_endpoint" {
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
  description = "Primary endpoint address for Redis cluster"
}

output "redis_port" {
  value       = aws_elasticache_replication_group.redis.port
  description = "Redis port (default: 6379)"
}

output "redis_url" {
  value       = "redis://${aws_elasticache_replication_group.redis.primary_endpoint_address}:${aws_elasticache_replication_group.redis.port}"
  description = "Full Redis connection URL for application"
}

output "replication_group_id" {
  value       = aws_elasticache_replication_group.redis.id
  description = "ElastiCache replication group ID"
}
