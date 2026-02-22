output "api_service_name" {
  value = aws_ecs_service.api.name
}

output "worker_service_name" {
  value = aws_ecs_service.worker.name
}

output "front_service_name" {
  value = var.enable_front ? aws_ecs_service.front[0].name : null
}
