# ==============================================================================
# ElastiCache Subnet Group
# ==============================================================================
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-redis-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = merge(var.tags, {
    Name = "${var.project_name}-redis-subnet-group"
  })
}

# ==============================================================================
# ElastiCache Replication Group (Redis Cluster)
# ==============================================================================
resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.project_name}-redis"
  description                = "Redis cluster for OAuth state and code storage"
  engine                     = "redis"
  engine_version             = "7.1"
  node_type                  = var.node_type
  num_cache_clusters         = var.num_cache_nodes
  port                       = 6379
  parameter_group_name       = "default.redis7"
  subnet_group_name          = aws_elasticache_subnet_group.redis.name
  security_group_ids         = [var.security_group_id]
  automatic_failover_enabled = var.num_cache_nodes > 1
  multi_az_enabled           = var.multi_az_enabled
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false # Set to false for simplicity; enable for production if needed
  snapshot_retention_limit   = var.snapshot_retention_limit
  snapshot_window            = "03:00-05:00" # Daily backup window (UTC)
  maintenance_window         = "sun:05:00-sun:07:00"
  auto_minor_version_upgrade = true
  apply_immediately          = var.apply_immediately

  tags = merge(var.tags, {
    Name        = "${var.project_name}-redis"
    Service     = "cache"
    Environment = "production"
    ManagedBy   = "terraform"
  })
}
