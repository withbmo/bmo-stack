resource "aws_dynamodb_table" "env_routing" {
  name         = "EnvRouting"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "host"

  attribute {
    name = "host"
    type = "S"
  }

  attribute {
    name = "envId"
    type = "S"
  }

  global_secondary_index {
    name            = "envId-index"
    hash_key        = "envId"
    projection_type = "ALL"
  }

  tags = merge(var.tags, { Name = "EnvRouting" })
}

output "table_name" {
  value = aws_dynamodb_table.env_routing.name
}

output "table_arn" {
  value = aws_dynamodb_table.env_routing.arn
}
