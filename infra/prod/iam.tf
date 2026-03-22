data "aws_iam_policy_document" "ecs_tasks_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

locals {
  api_runtime_secret_arn_effective = length(trimspace(var.api_runtime_secret_arn)) > 0 ? trimspace(var.api_runtime_secret_arn) : aws_secretsmanager_secret.api_runtime.arn
  db_runtime_secret_arn_effective  = length(trimspace(var.db_runtime_secret_arn)) > 0 ? trimspace(var.db_runtime_secret_arn) : aws_secretsmanager_secret.supabase_runtime.arn
  db_direct_secret_arn_effective   = length(trimspace(var.db_direct_secret_arn)) > 0 ? trimspace(var.db_direct_secret_arn) : aws_secretsmanager_secret.supabase_direct.arn
}

resource "aws_iam_role" "ecs_execution" {
  name               = "${local.name_prefix}-ecs-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
  tags               = merge(local.base_tags, { Name = "${local.name_prefix}-ecs-execution" })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_managed" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "ecs_execution_secrets" {
  statement {
    actions = [
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]

    resources = compact([
      local.api_runtime_secret_arn_effective,
      local.db_runtime_secret_arn_effective,
      var.enable_db_direct ? local.db_direct_secret_arn_effective : null,
    ])
  }
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  name   = "${local.name_prefix}-ecs-execution-secrets"
  role   = aws_iam_role.ecs_execution.id
  policy = data.aws_iam_policy_document.ecs_execution_secrets.json
}

resource "aws_iam_role" "ecs_task" {
  name               = "${local.name_prefix}-ecs-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume_role.json
  tags               = merge(local.base_tags, { Name = "${local.name_prefix}-ecs-task" })
}

data "aws_iam_policy_document" "ecs_exec" {
  count = var.enable_execute_command ? 1 : 0

  statement {
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel",
      "ssm:UpdateInstanceInformation",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ecs_exec" {
  count  = var.enable_execute_command ? 1 : 0
  name   = "${local.name_prefix}-ecs-exec"
  role   = aws_iam_role.ecs_task.id
  policy = data.aws_iam_policy_document.ecs_exec[0].json
}
