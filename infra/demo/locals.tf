locals {
  app_domain_name          = var.app_domain_prefix != "" ? "${var.app_domain_prefix}.${var.domain_name}" : var.domain_name
  edge_proxy_enabled       = var.enable_edge_proxy_when_no_alb && !var.enable_alb
  delegated_dns_enabled    = var.manage_delegated_dns && var.app_domain_prefix != ""
  delegated_dns_host_label = var.app_domain_prefix != "" ? trimsuffix(local.app_domain_name, ".${var.domain_name}") : ""

  tags = {
    Project = var.project_name
    Stack   = "demo"
    Managed = "terraform"
  }
}
