resource "aws_db_subnet_group" "this" {
  name       = "${var.project_name}-postgres-subnets"
  subnet_ids = var.private_subnet_ids

  tags = merge(var.tags, { Name = "${var.project_name}-postgres-subnets" })
}

resource "aws_security_group" "postgres" {
  name        = "${var.project_name}-postgres-sg"
  description = "Allow PostgreSQL from ECS services only"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.ecs_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, { Name = "${var.project_name}-postgres-sg" })
}

resource "aws_db_instance" "this" {
  for_each = var.instances

  identifier = "${var.project_name}-${each.key}-postgres"

  engine                     = "postgres"
  instance_class             = each.value.instance_class
  allocated_storage          = each.value.allocated_storage
  max_allocated_storage      = each.value.max_allocated_storage
  storage_type               = "gp3"
  storage_encrypted          = true
  db_subnet_group_name       = aws_db_subnet_group.this.name
  vpc_security_group_ids     = [aws_security_group.postgres.id]
  publicly_accessible        = false
  multi_az                   = each.value.multi_az
  backup_retention_period    = each.value.backup_retention_period
  deletion_protection        = each.value.deletion_protection
  skip_final_snapshot        = true
  auto_minor_version_upgrade = true
  apply_immediately          = true

  db_name  = "pytholit_${each.key}"
  username = var.master_username
  password = var.db_passwords[each.key]

  tags = merge(var.tags, { Name = "${var.project_name}-${each.key}-postgres" })
}
