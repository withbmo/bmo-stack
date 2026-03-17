locals {
  base_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags
  )
}

resource "aws_secretsmanager_secret" "supabase_runtime" {
  name                    = "${var.project_name}/db/prod-supabase"
  description             = "Supabase production runtime database settings for the API"
  recovery_window_in_days = 0

  tags = merge(local.base_tags, {
    Name    = "${var.project_name}-prod-supabase"
    Service = "database"
    Purpose = "runtime"
  })
}

resource "aws_secretsmanager_secret" "supabase_direct" {
  name                    = "${var.project_name}/db/prod-supabase-direct"
  description             = "Supabase production direct-host migration settings for Prisma"
  recovery_window_in_days = 0

  tags = merge(local.base_tags, {
    Name    = "${var.project_name}-prod-supabase-direct"
    Service = "database"
    Purpose = "migrations"
  })
}
