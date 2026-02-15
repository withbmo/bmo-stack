resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/demo-api"
  retention_in_days = 14
}

locals {
  base_secrets = [
    for s in [
      { name = "JWT_SECRET", valueFrom = var.jwt_secret_arn },
      { name = "ENV_SESSION_SECRET", valueFrom = var.env_session_secret_arn },
      { name = "TURNSTILE_SECRET_KEY", valueFrom = var.turnstile_secret_arn }
    ] : s if s.valueFrom != null && s.valueFrom != ""
  ]

  db_secrets = var.db_credentials_secret_arn != null && var.db_credentials_secret_arn != "" ? [
    { name = "DB_USER", valueFrom = "${var.db_credentials_secret_arn}:username::" },
    { name = "DB_PASSWORD", valueFrom = "${var.db_credentials_secret_arn}:password::" }
  ] : []

  container_secrets = concat(local.base_secrets, local.db_secrets)
}

resource "aws_ecs_task_definition" "this" {
  family                   = "demo-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = var.image
      essential = true
      portMappings = [{
        containerPort = 3001
        hostPort      = 3001
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.this.name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "api"
        }
      }
      environment = [
        { name = "DB_HOST", value = var.db_host != null ? var.db_host : "" },
        { name = "DB_PORT", value = tostring(var.db_port) },
        { name = "DB_NAME", value = var.db_name != null ? var.db_name : "" },
        { name = "DB_SSLMODE", value = "require" }
      ]
      secrets = local.container_secrets
    }
  ])

  tags = var.tags

  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_service" "this" {
  name            = "demo-api"
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }
  dynamic "load_balancer" {
    for_each = var.enable_load_balancer && var.target_group_arn != null ? [1] : []
    content {
      target_group_arn = var.target_group_arn
      container_name   = "api"
      container_port   = 3001
    }
  }

  depends_on = [aws_ecs_task_definition.this]

  tags = var.tags

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_appautoscaling_target" "this" {
  min_capacity       = var.autoscaling_min_capacity
  max_capacity       = var.autoscaling_max_capacity
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.this.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "demo-api-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.this.resource_id
  scalable_dimension = aws_appautoscaling_target.this.scalable_dimension
  service_namespace  = aws_appautoscaling_target.this.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 60
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}
