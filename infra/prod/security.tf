resource "aws_security_group" "alb" {
  name        = "${local.name_prefix}-alb"
  description = "Public ALB security group"
  vpc_id      = aws_vpc.this.id

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-alb-sg" })
}

resource "aws_security_group_rule" "alb_http" {
  type              = "ingress"
  security_group_id = aws_security_group.alb.id
  protocol          = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_blocks       = var.alb_allowed_cidrs
  description       = "HTTP from allowed CIDRs"
}

resource "aws_security_group_rule" "alb_https" {
  count             = var.enable_https ? 1 : 0
  type              = "ingress"
  security_group_id = aws_security_group.alb.id
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
  cidr_blocks       = var.alb_allowed_cidrs
  description       = "HTTPS from allowed CIDRs"
}

resource "aws_security_group_rule" "alb_egress" {
  type              = "egress"
  security_group_id = aws_security_group.alb.id
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "All egress"
}

resource "aws_security_group" "ecs_services" {
  name        = "${local.name_prefix}-ecs-services"
  description = "ECS services security group"
  vpc_id      = aws_vpc.this.id

  tags = merge(local.base_tags, { Name = "${local.name_prefix}-ecs-services-sg" })
}

resource "aws_security_group_rule" "ecs_egress" {
  type              = "egress"
  security_group_id = aws_security_group.ecs_services.id
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
  description       = "All egress"
}

resource "aws_security_group_rule" "ecs_from_alb_web" {
  type                     = "ingress"
  security_group_id        = aws_security_group.ecs_services.id
  protocol                 = "tcp"
  from_port                = 3000
  to_port                  = 3000
  source_security_group_id = aws_security_group.alb.id
  description              = "Web from ALB"
}

resource "aws_security_group_rule" "ecs_from_alb_api" {
  type                     = "ingress"
  security_group_id        = aws_security_group.ecs_services.id
  protocol                 = "tcp"
  from_port                = 3001
  to_port                  = 3001
  source_security_group_id = aws_security_group.alb.id
  description              = "API from ALB"
}
