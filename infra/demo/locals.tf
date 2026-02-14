locals {
  app_domain_name = var.app_domain_prefix != "" ? "${var.app_domain_prefix}.${var.domain_name}" : var.domain_name

  tags = {
    Project = var.project_name
    Stack   = "demo"
    Managed = "terraform"
  }
}
