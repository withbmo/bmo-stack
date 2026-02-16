variable "project_name" {
  type        = string
  description = "Project name prefix for resources"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "List of private subnet IDs for ElastiCache"
}

variable "security_group_id" {
  type        = string
  description = "Security group ID for Redis cluster"
}

variable "node_type" {
  type        = string
  default     = "cache.t3.micro"
  description = "ElastiCache node instance type (cache.t3.micro = 0.5 GB RAM)"
}

variable "num_cache_nodes" {
  type        = number
  default     = 1
  description = "Number of cache nodes (1 = single node, 2+ = cluster mode with failover)"
}

variable "multi_az_enabled" {
  type        = bool
  default     = false
  description = "Enable Multi-AZ for automatic failover (requires num_cache_nodes >= 2)"
}

variable "snapshot_retention_limit" {
  type        = number
  default     = 5
  description = "Number of days to retain automatic snapshots (0 = disabled)"
}

variable "apply_immediately" {
  type        = bool
  default     = false
  description = "Apply changes immediately instead of during maintenance window"
}

variable "tags" {
  type    = map(string)
  default = {}
}
