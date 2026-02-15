locals {
  app_domain_name    = var.app_domain_prefix != "" ? "${var.app_domain_prefix}.${var.domain_name}" : var.domain_name
  edge_proxy_enabled = var.enable_edge_proxy_when_no_alb && !var.enable_alb

  tags = {
    Project = var.project_name
    Stack   = "demo"
    Managed = "terraform"
  }
}
