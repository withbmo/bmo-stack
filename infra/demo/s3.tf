# ==============================================================================
# S3 — Avatar Storage
# ==============================================================================

resource "aws_s3_bucket" "avatars" {
  bucket = "${var.project_name}-avatars"
  tags   = merge(local.tags, { Name = "${var.project_name}-avatars" })
}

resource "aws_s3_bucket_public_access_block" "avatars" {
  bucket = aws_s3_bucket.avatars.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "avatars_public_read" {
  bucket = aws_s3_bucket.avatars.id

  depends_on = [aws_s3_bucket_public_access_block.avatars]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.avatars.arn}/*"
      }
    ]
  })
}

data "aws_iam_policy_document" "api_s3_avatars" {
  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.avatars.arn}/*"]
  }
}

resource "aws_iam_role_policy" "api_s3_avatars" {
  name   = "demo-api-s3-avatars"
  role   = module.iam.api_task_role_name
  policy = data.aws_iam_policy_document.api_s3_avatars.json
}
