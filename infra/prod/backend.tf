terraform {
  backend "s3" {
    bucket         = "pytholit-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "pytholit-terraform-locks"
    encrypt        = true
  }
}
