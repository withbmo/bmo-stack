data "tls_certificate" "github_actions" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github_actions.certificates[0].sha1_fingerprint]

  tags = merge(var.tags, {
    Name    = "github-actions-oidc"
    Project = var.project
    Managed = "terraform"
  })
}

locals {
  repo_slug = "${var.github_org}/${var.github_repo}"

  oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : var.github_oidc_provider_arn

  dev_subs = concat(
    [for b in var.dev_branch_patterns : "repo:${local.repo_slug}:ref:refs/heads/${b}"],
    ["repo:${local.repo_slug}:environment:dev"]
  )
  prod_subs = concat(
    [for b in var.prod_branch_patterns : "repo:${local.repo_slug}:ref:refs/heads/${b}"],
    ["repo:${local.repo_slug}:environment:prod"]
  )

  plan_subs = concat(
    [for b in var.dev_branch_patterns : "repo:${local.repo_slug}:ref:refs/heads/${b}"],
    [for b in var.prod_branch_patterns : "repo:${local.repo_slug}:ref:refs/heads/${b}"],
    var.plan_role_include_pull_request ? ["repo:${local.repo_slug}:pull_request"] : []
  )

  role_names = {
    dev  = "github-actions-${var.project}-dev-deploy"
    prod = "github-actions-${var.project}-prod-deploy"
    plan = "github-actions-${var.project}-plan"
  }

  role_policy_arns = {
    dev  = var.dev_role_policy_arns
    prod = var.prod_role_policy_arns
    plan = var.plan_role_policy_arns
  }

  role_attachments = flatten([
    for role_key, arns in local.role_policy_arns : [
      for policy_arn in arns : {
        key        = "${role_key}-${replace(policy_arn, ":", "_")}"
        role_key   = role_key
        policy_arn = policy_arn
      }
    ]
  ])
}

data "aws_iam_policy_document" "dev_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.dev_subs
    }
  }
}

data "aws_iam_policy_document" "prod_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.prod_subs
    }
  }
}

data "aws_iam_policy_document" "plan_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.plan_subs
    }
  }
}

resource "aws_iam_role" "dev" {
  name               = local.role_names.dev
  assume_role_policy = data.aws_iam_policy_document.dev_assume.json

  tags = merge(var.tags, {
    Name    = local.role_names.dev
    Project = var.project
    Managed = "terraform"
  })
}

resource "aws_iam_role" "prod" {
  name               = local.role_names.prod
  assume_role_policy = data.aws_iam_policy_document.prod_assume.json

  tags = merge(var.tags, {
    Name    = local.role_names.prod
    Project = var.project
    Managed = "terraform"
  })
}

resource "aws_iam_role" "plan" {
  name               = local.role_names.plan
  assume_role_policy = data.aws_iam_policy_document.plan_assume.json

  tags = merge(var.tags, {
    Name    = local.role_names.plan
    Project = var.project
    Managed = "terraform"
  })
}

resource "aws_iam_role_policy_attachment" "managed" {
  for_each = { for item in local.role_attachments : item.key => item }

  role = (
    each.value.role_key == "dev" ? aws_iam_role.dev.name :
    each.value.role_key == "prod" ? aws_iam_role.prod.name :
    aws_iam_role.plan.name
  )

  policy_arn = each.value.policy_arn
}
