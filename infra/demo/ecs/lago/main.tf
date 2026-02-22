locals {
  database_url = "postgresql://${var.db_user}:${var.db_password}@${var.db_host}:${var.db_port}/${var.db_name}"
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/lago-api"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "worker" {
  name              = "/ecs/lago-worker"
  retention_in_days = 14
}

resource "aws_cloudwatch_log_group" "front" {
  count             = var.enable_front ? 1 : 0
  name              = "/ecs/lago-front"
  retention_in_days = 14
}

resource "aws_ecs_task_definition" "api" {
  family                   = "lago-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "2048"
  memory                   = "4096"
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "lago-api"
      image     = var.api_image
      essential = true
      portMappings = [{
        containerPort = 3000
        hostPort      = 3000
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.api.name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "lago-api"
        }
      }
      environment = [
        { name = "DATABASE_URL", value = local.database_url },
        { name = "REDIS_URL", value = var.redis_url },
        { name = "LAGO_API_URL", value = var.api_url },
        { name = "LAGO_FRONT_URL", value = var.front_url },
        { name = "LAGO_API_KEY", value = var.api_key },
        { name = "STRIPE_SECRET_KEY", value = var.stripe_secret_key },
        { name = "SECRET_KEY_BASE", value = var.secret_key_base }
      ]
    }
  ])

  tags = var.tags

  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_service" "api" {
  name            = "lago-api"
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = var.api_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  dynamic "load_balancer" {
    for_each = var.enable_load_balancer && var.api_target_group_arn != null ? [1] : []
    content {
      target_group_arn = var.api_target_group_arn
      container_name   = "lago-api"
      container_port   = 3000
    }
  }

  depends_on = [aws_ecs_task_definition.api]
  tags       = var.tags

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_ecs_task_definition" "worker" {
  family                   = "lago-worker"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "lago-worker"
      image     = var.worker_image
      essential = true
      command   = ["bundle", "exec", "sidekiq"]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.worker.name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "lago-worker"
        }
      }
      environment = [
        { name = "DATABASE_URL", value = local.database_url },
        { name = "REDIS_URL", value = var.redis_url },
        { name = "LAGO_API_URL", value = var.api_url },
        { name = "LAGO_FRONT_URL", value = var.front_url },
        { name = "LAGO_API_KEY", value = var.api_key },
        { name = "STRIPE_SECRET_KEY", value = var.stripe_secret_key },
        { name = "SECRET_KEY_BASE", value = var.secret_key_base }
      ]
    }
  ])

  tags = var.tags

  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_service" "worker" {
  name            = "lago-worker"
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = var.worker_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  depends_on = [aws_ecs_task_definition.worker]
  tags       = var.tags

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}

resource "aws_ecs_task_definition" "front" {
  count                    = var.enable_front ? 1 : 0
  family                   = "lago-front"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = "lago-front"
      image     = var.front_image
      essential = true
      portMappings = [{
        containerPort = 80
        hostPort      = 80
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.front[0].name
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "lago-front"
        }
      }
      environment = [
        { name = "API_URL", value = var.api_url }
      ]
    }
  ])

  tags = var.tags

  lifecycle {
    ignore_changes = [container_definitions]
  }
}

resource "aws_ecs_service" "front" {
  count           = var.enable_front ? 1 : 0
  name            = "lago-front"
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.front[0].arn
  desired_count   = var.front_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  depends_on = [aws_ecs_task_definition.front]
  tags       = var.tags

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}
