data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  name_prefix     = "${var.project_name}-${var.environment}"
  safe_prefix     = lower(local.name_prefix)
  short_prefix_24 = substr(local.safe_prefix, 0, 24)

  base_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags
  )

  azs = slice(data.aws_availability_zones.available.names, 0, var.az_count)

  # Domain helpers (optional, but required when routing_mode=host)
  app_domain_name = var.domain_name == "" ? "" : (var.app_domain_prefix != "" ? "${var.app_domain_prefix}.${var.domain_name}" : var.domain_name)

  web_host = local.app_domain_name
  api_host = local.app_domain_name != "" ? "api.${local.app_domain_name}" : ""

  alb_name    = substr("${local.short_prefix_24}-alb", 0, 32)
  tg_web_name = substr("${local.short_prefix_24}-web", 0, 32)
  tg_api_name = substr("${local.short_prefix_24}-api", 0, 32)
}
