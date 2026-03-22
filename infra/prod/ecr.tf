resource "aws_ecr_repository" "web" {
  count = var.create_ecr_repositories ? 1 : 0

  name                 = "${local.safe_prefix}/web"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(local.base_tags, { Service = "web" })
}

resource "aws_ecr_repository" "api" {
  count = var.create_ecr_repositories ? 1 : 0

  name                 = "${local.safe_prefix}/api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(local.base_tags, { Service = "api" })
}
