output "supabase_runtime_secret_arn" {
  value       = aws_secretsmanager_secret.supabase_runtime.arn
  description = "ARN of the production Supabase runtime database secret"
}

output "supabase_runtime_secret_name" {
  value       = aws_secretsmanager_secret.supabase_runtime.name
  description = "Name of the production Supabase runtime database secret"
}

output "supabase_direct_secret_arn" {
  value       = aws_secretsmanager_secret.supabase_direct.arn
  description = "ARN of the optional production Supabase direct migration secret"
}

output "supabase_direct_secret_name" {
  value       = aws_secretsmanager_secret.supabase_direct.name
  description = "Name of the optional production Supabase direct migration secret"
}
