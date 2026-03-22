resource "aws_security_group" "alb_app" {
  name        = "demo-alb-app-sg"
  description = "Public ALB app SG"
  vpc_id      = var.services_vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, { Name = "demo-alb-app-sg" })
}

resource "aws_security_group" "ecs_services" {
  name        = "demo-ecs-services-sg"
  description = "ECS services SG"
  vpc_id      = var.services_vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_app.id]
  }

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_app.id]
  }

  ingress {
    from_port   = 3401
    to_port     = 3401
    protocol    = "tcp"
    cidr_blocks = [var.services_vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, { Name = "demo-ecs-services-sg" })
}

resource "aws_security_group" "env_instance" {
  name        = "demo-env-instance-sg"
  description = "Environment VM SG"
  vpc_id      = var.envs_vpc_id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [var.services_vpc_cidr]
  }

  ingress {
    from_port   = 9000
    to_port     = 9999
    protocol    = "tcp"
    cidr_blocks = [var.services_vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, { Name = "demo-env-instance-sg" })
}

resource "aws_security_group" "elasticache_redis" {
  name        = "demo-elasticache-redis-sg"
  description = "ElastiCache Redis cluster security group"
  vpc_id      = var.services_vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_services.id]
    description     = "Allow Redis access from ECS services"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name      = "demo-elasticache-redis-sg"
    Service   = "cache"
    ManagedBy = "terraform"
  })
}

output "alb_app_security_group_id" {
  value = aws_security_group.alb_app.id
}

output "ecs_services_security_group_id" {
  value = aws_security_group.ecs_services.id
}

output "env_instance_security_group_id" {
  value = aws_security_group.env_instance.id
}

output "elasticache_redis_security_group_id" {
  value = aws_security_group.elasticache_redis.id
}
