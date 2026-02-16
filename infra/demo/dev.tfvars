project_name      = "pytholit-demo"
domain_name       = "pytholit.dev"
app_domain_prefix = "dev"
api_database_env  = "dev"

# Keep false until AWS enables ALB creation for this account.
enable_alb     = true
enable_dns_acm = true

# Docker images
images = {
  web              = "public.ecr.aws/docker/library/nginx:stable"
  api              = "600161850626.dkr.ecr.us-east-1.amazonaws.com/api:demo-20260216072044"
  terminal_gateway = "public.ecr.aws/docker/library/nginx:stable"
  ingress_router   = "public.ecr.aws/docker/library/nginx:stable"
  orchestrator     = "public.ecr.aws/docker/library/nginx:stable"
}
