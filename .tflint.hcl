config {
  # Lint modules too (this repo is module-heavy under infra/demo).
  call_module_type = "all"
}

plugin "aws" {
  enabled = true
  version = "0.37.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

