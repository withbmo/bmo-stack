resource "aws_ecs_cluster" "this" {
  name = "demo-services-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(var.tags, { Name = "demo-services-cluster" })
}

output "cluster_arn" {
  value = aws_ecs_cluster.this.arn
}

output "cluster_name" {
  value = aws_ecs_cluster.this.name
}
