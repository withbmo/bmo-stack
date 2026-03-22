resource "aws_ecs_cluster" "this" {
  name = "${local.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-cluster" })
}

resource "aws_cloudwatch_log_group" "web" {
  name              = "/ecs/${local.name_prefix}/web"
  retention_in_days = 30
  tags              = merge(local.base_tags, { Service = "web" })
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/${local.name_prefix}/api"
  retention_in_days = 30
  tags              = merge(local.base_tags, { Service = "api" })
}

locals {
  alb_scheme = var.enable_https ? "https" : "http"
  alb_base   = "${local.alb_scheme}://${aws_lb.this.dns_name}"

  api_url = local.app_domain_name != "" ? (
    var.routing_mode == "host" ? "https://${local.api_host}" : "https://${local.web_host}"
  ) : local.alb_base

  frontend_url  = local.app_domain_name != "" ? "https://${local.web_host}" : local.alb_base
  cookie_domain = local.app_domain_name != "" ? ".${var.domain_name}" : ""
}

resource "aws_ecs_task_definition" "web" {
  family                   = "${local.name_prefix}-web"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = tostring(var.service_cpu.web)
  memory                   = tostring(var.service_memory.web)
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "web"
      image     = var.images.web
      essential = true
      portMappings = [{
        containerPort = 3000
        hostPort      = 3000
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.web.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "web"
        }
      }
      environment = concat(
        [
          { name = "NODE_ENV", value = "production" },
          { name = "PORT", value = "3000" }
        ],
        [for k, v in var.web_env : { name = k, value = v }]
      )
    }
  ])

  tags = merge(local.base_tags, { Service = "web" })

  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "${local.name_prefix}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = tostring(var.service_cpu.api)
  memory                   = tostring(var.service_memory.api)
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = var.images.api
      essential = true
      portMappings = [{
        containerPort = 3001
        hostPort      = 3001
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.api.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "api"
        }
      }
      environment = concat(
        [
          { name = "NODE_ENV", value = "production" },
          { name = "PORT", value = "3001" },
          { name = "API_URL", value = local.api_url },
          { name = "FRONTEND_URL", value = local.frontend_url },
          { name = "COOKIE_DOMAIN", value = local.cookie_domain },
          { name = "ENABLE_HSTS", value = var.enable_https ? "true" : "false" }
        ],
        [for k, v in var.api_env : { name = k, value = v }]
      )
      secrets = concat(
        [
          { name = "JWT_SECRET", valueFrom = "${local.api_runtime_secret_arn_effective}:JWT_SECRET::" },
          { name = "ENV_SESSION_SECRET", valueFrom = "${local.api_runtime_secret_arn_effective}:ENV_SESSION_SECRET::" },
          { name = "DB_HOST", valueFrom = "${local.db_runtime_secret_arn_effective}:host::" },
          { name = "DB_PORT", valueFrom = "${local.db_runtime_secret_arn_effective}:port::" },
          { name = "DB_NAME", valueFrom = "${local.db_runtime_secret_arn_effective}:dbname::" },
          { name = "DB_USERNAME", valueFrom = "${local.db_runtime_secret_arn_effective}:username::" },
          { name = "DB_PASSWORD", valueFrom = "${local.db_runtime_secret_arn_effective}:password::" },
          { name = "DB_SSLMODE", valueFrom = "${local.db_runtime_secret_arn_effective}:sslmode::" }
        ],
        var.enable_db_direct ? [
          { name = "DB_DIRECT_HOST", valueFrom = "${local.db_direct_secret_arn_effective}:host::" },
          { name = "DB_DIRECT_PORT", valueFrom = "${local.db_direct_secret_arn_effective}:port::" }
        ] : []
      )
    }
  ])

  tags = merge(local.base_tags, { Service = "api" })

  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_service" "web" {
  name                   = "${local.name_prefix}-web"
  cluster                = aws_ecs_cluster.this.arn
  task_definition        = aws_ecs_task_definition.web.arn
  desired_count          = var.desired_count.web
  launch_type            = "FARGATE"
  enable_execute_command = var.enable_execute_command

  network_configuration {
    subnets          = [for az in local.azs : aws_subnet.private[az].id]
    security_groups  = [aws_security_group.ecs_services.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn
    container_name   = "web"
    container_port   = 3000
  }

  health_check_grace_period_seconds = 60

  depends_on = [aws_lb_listener.http, aws_lb_listener.https]

  tags = merge(local.base_tags, { Service = "web" })

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_ecs_service" "api" {
  name                   = "${local.name_prefix}-api"
  cluster                = aws_ecs_cluster.this.arn
  task_definition        = aws_ecs_task_definition.api.arn
  desired_count          = var.desired_count.api
  launch_type            = "FARGATE"
  enable_execute_command = var.enable_execute_command

  network_configuration {
    subnets          = [for az in local.azs : aws_subnet.private[az].id]
    security_groups  = [aws_security_group.ecs_services.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 3001
  }

  health_check_grace_period_seconds = 60

  depends_on = [aws_lb_listener_rule.api]

  tags = merge(local.base_tags, { Service = "api" })

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_appautoscaling_target" "web" {
  min_capacity       = max(1, var.desired_count.web)
  max_capacity       = max(2, var.desired_count.web * 4)
  resource_id        = "service/${aws_ecs_cluster.this.name}/${aws_ecs_service.web.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "web_cpu" {
  name               = "${local.name_prefix}-web-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.web.resource_id
  scalable_dimension = aws_appautoscaling_target.web.scalable_dimension
  service_namespace  = aws_appautoscaling_target.web.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 60
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_target" "api" {
  min_capacity       = max(1, var.desired_count.api)
  max_capacity       = max(2, var.desired_count.api * 4)
  resource_id        = "service/${aws_ecs_cluster.this.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "${local.name_prefix}-api-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 60
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}
