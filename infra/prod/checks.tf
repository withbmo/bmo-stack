check "routing_mode_requires_domain" {
  assert {
    condition     = var.routing_mode != "host" || length(trimspace(var.domain_name)) > 0
    error_message = "domain_name must be set when routing_mode=host."
  }
}

check "https_requires_certificate" {
  assert {
    condition     = !var.enable_https || length(trimspace(var.certificate_arn)) > 0
    error_message = "certificate_arn must be set when enable_https=true."
  }
}

check "dns_requires_domain" {
  assert {
    condition     = !var.manage_root_dns || length(trimspace(var.domain_name)) > 0
    error_message = "manage_root_dns=true requires domain_name to be set."
  }
}
