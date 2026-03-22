resource "aws_lb" "this" {
  name               = local.alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [for az in local.azs : aws_subnet.public[az].id]
  idle_timeout       = 3600

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-alb" })
}

resource "aws_lb_target_group" "web" {
  name        = local.tg_web_name
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.this.id
  target_type = "ip"

  health_check {
    path    = "/"
    matcher = "200-399"
  }

  tags = merge(local.base_tags, { Service = "web" })
}

resource "aws_lb_target_group" "api" {
  name        = local.tg_api_name
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = aws_vpc.this.id
  target_type = "ip"

  health_check {
    path = "/api/v1/health"
  }

  tags = merge(local.base_tags, { Service = "api" })
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  dynamic "default_action" {
    for_each = var.enable_https ? [1] : []
    content {
      type = "redirect"
      redirect {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
  }

  dynamic "default_action" {
    for_each = var.enable_https ? [] : [1]
    content {
      type             = "forward"
      target_group_arn = aws_lb_target_group.web.arn
    }
  }

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-http" })
}

resource "aws_lb_listener" "https" {
  count = var.enable_https ? 1 : 0

  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-https" })
}

locals {
  app_listener_arn = var.enable_https ? aws_lb_listener.https[0].arn : aws_lb_listener.http.arn
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = local.app_listener_arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  dynamic "condition" {
    for_each = var.routing_mode == "host" ? [1] : []
    content {
      host_header {
        values = [local.api_host]
      }
    }
  }

  dynamic "condition" {
    for_each = var.routing_mode == "path" ? [1] : []
    content {
      path_pattern {
        values = ["/api/*"]
      }
    }
  }
}
