output "security_group_id" {
  value = aws_security_group.postgres.id
}

output "endpoints" {
  value = {
    for env, db in aws_db_instance.this : env => db.address
  }
}

output "ports" {
  value = {
    for env, db in aws_db_instance.this : env => db.port
  }
}
