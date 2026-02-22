resource "aws_lb" "this" {
  name               = "demo-app-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids
  idle_timeout       = 3600

  tags = merge(var.tags, { Name = "demo-app-alb" })
}

resource "aws_lb_target_group" "web" {
  name        = "demo-web-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path    = "/"
    matcher = "200-399"
  }
}

resource "aws_lb_target_group" "api" {
  name        = "demo-api-tg"
  port        = 3001
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/api/v1/health"
  }
}

resource "aws_lb_target_group" "terminal" {
  name        = "demo-term-tg"
  port        = 3403
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/health"
  }
}

resource "aws_lb_target_group" "lago" {
  count = var.enable_lago ? 1 : 0

  name        = "demo-lago-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path    = "/health"
    matcher = "200-399"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web.arn
  }
}

resource "aws_lb_listener_rule" "api_http" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    host_header {
      values = ["api.${var.app_domain_name}"]
    }
  }
}

resource "aws_lb_listener_rule" "terminal_http" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.terminal.arn
  }

  condition {
    host_header {
      values = ["terminal.${var.app_domain_name}"]
    }
  }
}

resource "aws_lb_listener_rule" "lago_http" {
  count = var.enable_lago ? 1 : 0

  listener_arn = aws_lb_listener.http.arn
  priority     = 30

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lago[0].arn
  }

  condition {
    host_header {
      values = ["lago.${var.app_domain_name}"]
    }
  }
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
}

resource "aws_lb_listener_rule" "api_https" {
  count = var.enable_https ? 1 : 0

  listener_arn = aws_lb_listener.https[0].arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    host_header {
      values = ["api.${var.app_domain_name}"]
    }
  }
}

resource "aws_lb_listener_rule" "terminal_https" {
  count = var.enable_https ? 1 : 0

  listener_arn = aws_lb_listener.https[0].arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.terminal.arn
  }

  condition {
    host_header {
      values = ["terminal.${var.app_domain_name}"]
    }
  }
}

resource "aws_lb_listener_rule" "lago_https" {
  count = var.enable_https && var.enable_lago ? 1 : 0

  listener_arn = aws_lb_listener.https[0].arn
  priority     = 30

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.lago[0].arn
  }

  condition {
    host_header {
      values = ["lago.${var.app_domain_name}"]
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "lago_unhealthy_targets" {
  count = var.enable_lago ? 1 : 0

  alarm_name          = "lago-unhealthy-targets"
  alarm_description   = "Lago target group has unhealthy targets"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "UnHealthyHostCount"
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 2
  comparison_operator = "GreaterThanThreshold"
  threshold           = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = var.alarm_actions

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.lago[0].arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "lago_alb_5xx" {
  count = var.enable_lago ? 1 : 0

  alarm_name          = "lago-alb-5xx-high"
  alarm_description   = "Lago ALB 5xx responses are above threshold"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "HTTPCode_Target_5XX_Count"
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 2
  comparison_operator = "GreaterThanThreshold"
  threshold           = 10
  treat_missing_data  = "notBreaching"
  alarm_actions       = var.alarm_actions

  dimensions = {
    LoadBalancer = aws_lb.this.arn_suffix
    TargetGroup  = aws_lb_target_group.lago[0].arn_suffix
  }
}

output "alb_arn" {
  value = aws_lb.this.arn
}

output "alb_dns_name" {
  value = aws_lb.this.dns_name
}

output "alb_zone_id" {
  value = aws_lb.this.zone_id
}

output "web_target_group_arn" {
  value = aws_lb_target_group.web.arn
}

output "api_target_group_arn" {
  value = aws_lb_target_group.api.arn
}

output "terminal_target_group_arn" {
  value = aws_lb_target_group.terminal.arn
}

output "lago_target_group_arn" {
  value = var.enable_lago ? aws_lb_target_group.lago[0].arn : null
}

output "lago_unhealthy_targets_alarm_arn" {
  value = var.enable_lago ? aws_cloudwatch_metric_alarm.lago_unhealthy_targets[0].arn : null
}

output "lago_alb_5xx_alarm_arn" {
  value = var.enable_lago ? aws_cloudwatch_metric_alarm.lago_alb_5xx[0].arn : null
}
