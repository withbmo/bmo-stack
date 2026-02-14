output "jwt_secret_arn" {
  value = aws_secretsmanager_secret.jwt_secret.arn
}

output "env_session_secret_arn" {
  value = aws_secretsmanager_secret.env_session_secret.arn
}
