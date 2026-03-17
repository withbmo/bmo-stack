data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "ecs_execution" {
  name               = "demo-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "ecs_execution_secrets" {
  statement {
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = var.secret_arns
  }
}

resource "aws_iam_role_policy" "ecs_execution_secrets" {
  count = length(var.secret_arns) > 0 ? 1 : 0

  name   = "demo-ecs-execution-secrets-access"
  role   = aws_iam_role.ecs_execution.id
  policy = data.aws_iam_policy_document.ecs_execution_secrets.json
}

resource "aws_iam_role" "api_task" {
  name               = "demo-api-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role" "ingress_task" {
  name               = "demo-ingress-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role" "orchestrator_task" {
  name               = "demo-orchestrator-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role" "terminal_task" {
  name               = "demo-terminal-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role" "web_task" {
  name               = "demo-web-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "terminal_ssm" {
  role       = aws_iam_role.terminal_task.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMFullAccess"
}

resource "aws_iam_role_policy_attachment" "orchestrator_ec2" {
  role       = aws_iam_role.orchestrator_task.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess"
}

resource "aws_iam_role_policy_attachment" "orchestrator_dynamodb" {
  role       = aws_iam_role.orchestrator_task.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "env_instance" {
  name               = "demo-env-instance-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "env_ssm" {
  role       = aws_iam_role.env_instance.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "env_instance" {
  name = "demo-env-instance-profile"
  role = aws_iam_role.env_instance.name
}

output "ecs_execution_role_arn" {
  value = aws_iam_role.ecs_execution.arn
}

output "web_task_role_arn" {
  value = aws_iam_role.web_task.arn
}

output "api_task_role_arn" {
  value = aws_iam_role.api_task.arn
}

output "api_task_role_name" {
  value = aws_iam_role.api_task.name
}

output "terminal_task_role_arn" {
  value = aws_iam_role.terminal_task.arn
}

output "ingress_task_role_arn" {
  value = aws_iam_role.ingress_task.arn
}

output "orchestrator_task_role_arn" {
  value = aws_iam_role.orchestrator_task.arn
}

output "env_instance_profile_name" {
  value = aws_iam_instance_profile.env_instance.name
}
