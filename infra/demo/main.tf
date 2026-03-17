module "servicesvpc" {
  source      = "./vpc_base"
  name_prefix = "services"
  vpc_cidr    = var.services_vpc_cidr
  region      = var.region
  interface_endpoint_services = [
    "com.amazonaws.${var.region}.sts",
    "com.amazonaws.${var.region}.ssm",
    "com.amazonaws.${var.region}.ssmmessages",
    "com.amazonaws.${var.region}.ec2messages",
    "com.amazonaws.${var.region}.ecr.api",
    "com.amazonaws.${var.region}.ecr.dkr",
    "com.amazonaws.${var.region}.logs",
  ]
  tags = local.tags
}

module "envsvpc" {
  source      = "./vpc_base"
  name_prefix = "envs"
  vpc_cidr    = var.envs_vpc_cidr
  region      = var.region
  interface_endpoint_services = [
    "com.amazonaws.${var.region}.ssm",
    "com.amazonaws.${var.region}.ssmmessages",
    "com.amazonaws.${var.region}.ec2messages",
    "com.amazonaws.${var.region}.ecr.api",
    "com.amazonaws.${var.region}.ecr.dkr",
  ]
  tags = local.tags
}

module "tgw" {
  source                           = "./tgw"
  services_vpc_id                  = module.servicesvpc.vpc_id
  envs_vpc_id                      = module.envsvpc.vpc_id
  services_private_subnet_ids      = module.servicesvpc.private_subnet_ids
  envs_private_subnet_ids          = module.envsvpc.private_subnet_ids
  services_private_route_table_ids = module.servicesvpc.private_route_table_ids
  envs_private_route_table_ids     = module.envsvpc.private_route_table_ids
  services_vpc_cidr                = var.services_vpc_cidr
  envs_vpc_cidr                    = var.envs_vpc_cidr
  tags                             = local.tags
}

module "security" {
  source            = "./security"
  services_vpc_id   = module.servicesvpc.vpc_id
  envs_vpc_id       = module.envsvpc.vpc_id
  services_vpc_cidr = var.services_vpc_cidr
  tags              = local.tags
}

module "postgres" {
  source                = "./postgres"
  project_name          = var.project_name
  vpc_id                = module.servicesvpc.vpc_id
  private_subnet_ids    = module.servicesvpc.private_subnet_ids
  ecs_security_group_id = module.security.ecs_services_security_group_id
  master_username       = var.postgres_master_username
  instances             = var.postgres_instances
  db_passwords = {
    dev  = module.secrets.db_dev_password
    prod = module.secrets.db_prod_password
  }
  tags = local.tags

  depends_on = [module.secrets]
}

module "secrets" {
  source             = "./secrets"
  project_name       = var.project_name
  db_master_username = var.postgres_master_username
  tags               = local.tags
}

module "iam" {
  source = "./iam"
  tags   = local.tags
  secret_arns = compact([
    module.secrets.jwt_secret_arn,
    module.secrets.env_session_secret_arn,
    module.secrets.zeptomail_api_key_arn,
    var.api_database_env == "prod" ? module.secrets.turnstile_secret_prod_arn : module.secrets.turnstile_secret_dev_arn,
    module.secrets.db_dev_secret_arn,
    module.secrets.db_prod_secret_arn,
    module.secrets.github_client_id_dev_arn,
    module.secrets.github_client_secret_dev_arn,
    module.secrets.github_client_id_prod_arn,
    module.secrets.github_client_secret_prod_arn,
    module.secrets.google_client_id_arn,
    module.secrets.google_client_secret_arn,
    var.api_database_provider == "supabase" ? module.secrets.supabase_prod_secret_arn : null,
    var.api_database_provider == "supabase" && var.api_supabase_direct_url_enabled ? module.secrets.supabase_prod_direct_secret_arn : null,
  ])
}

module "dynamodb" {
  source = "./dynamodb"
  tags   = local.tags
}

module "compute" {
  source                = "./compute"
  instance_profile_name = module.iam.env_instance_profile_name
  security_group_ids    = [module.security.env_instance_security_group_id]
  tags                  = local.tags
}

module "elasticache" {
  source             = "./elasticache"
  project_name       = var.project_name
  private_subnet_ids = module.servicesvpc.private_subnet_ids
  security_group_id  = module.security.elasticache_redis_security_group_id
  node_type          = "cache.t3.micro" # 0.5 GB RAM - good for OAuth state/code storage
  num_cache_nodes    = 1                # Single node for demo; use 2+ for production
  multi_az_enabled   = false            # Enable for production
  tags               = local.tags
}

module "route53_delegated" {
  count = local.delegated_dns_enabled ? 1 : 0

  source             = "./route53_delegated"
  zone_name          = local.app_domain_name
  app_alb_dns_name   = var.enable_alb ? module.alb_app[0].alb_dns_name : null
  app_alb_zone_id    = var.enable_alb ? module.alb_app[0].alb_zone_id : null
  env_alb_dns_name   = var.enable_alb ? module.alb_env[0].alb_dns_name : null
  env_alb_zone_id    = var.enable_alb ? module.alb_env[0].alb_zone_id : null
  enable_alb_records = var.enable_alb
  tags               = local.tags
}

module "route53_root" {
  count = var.manage_root_dns ? 1 : 0

  source    = "./route53_root"
  zone_name = var.domain_name
  tags      = local.tags
}

module "route53_records" {
  count = var.manage_root_dns && var.enable_alb ? 1 : 0

  source          = "./route53_records"
  zone_id         = module.route53_root[0].zone_id
  zone_name       = var.domain_name
  app_domain_name = local.app_domain_name

  app_alb_dns_name = module.alb_app[0].alb_dns_name
  app_alb_zone_id  = module.alb_app[0].alb_zone_id
  env_alb_dns_name = module.alb_env[0].alb_dns_name
  env_alb_zone_id  = module.alb_env[0].alb_zone_id

  enable_alb_records = var.enable_alb

  extra_txt_records   = var.route53_extra_txt_records
  extra_cname_records = var.route53_extra_cname_records
  extra_mx_records    = var.route53_extra_mx_records
}

module "alb_app" {
  count = var.enable_alb ? 1 : 0

  source                = "./alb_app"
  vpc_id                = module.servicesvpc.vpc_id
  public_subnet_ids     = module.servicesvpc.public_subnet_ids
  alb_security_group_id = module.security.alb_app_security_group_id
  app_domain_name       = local.app_domain_name
  certificate_arn       = var.enable_dns_acm ? module.dns_acm[0].app_certificate_arn : null
  enable_https          = var.enable_dns_acm
  tags                  = local.tags
}

module "alb_env" {
  count = var.enable_alb ? 1 : 0

  source                = "./alb_env"
  vpc_id                = module.servicesvpc.vpc_id
  public_subnet_ids     = module.servicesvpc.public_subnet_ids
  alb_security_group_id = module.security.alb_env_security_group_id
  certificate_arn       = var.enable_dns_acm ? coalesce(module.dns_acm[0].env_certificate_arn, module.dns_acm[0].app_certificate_arn) : null
  enable_https          = var.enable_dns_acm
  tags                  = local.tags
}

module "dns_acm" {
  count = var.enable_dns_acm ? 1 : 0

  source                     = "./dns_acm"
  app_domain_name            = local.app_domain_name
  validation_route53_zone_id = var.manage_root_dns ? module.route53_root[0].zone_id : (local.delegated_dns_enabled ? module.route53_delegated[0].zone_id : null)
  manage_validation_records  = var.manage_root_dns
  app_alb_dns_name           = var.enable_alb ? module.alb_app[0].alb_dns_name : ""
  env_alb_dns_name           = var.enable_alb ? module.alb_env[0].alb_dns_name : ""
  tags                       = local.tags
}

module "ecs_shared" {
  source = "./ecs/shared"
  tags   = local.tags
}

module "ecs_web" {
  source               = "./ecs/web"
  cluster_arn          = module.ecs_shared.cluster_arn
  cluster_name         = module.ecs_shared.cluster_name
  private_subnet_ids   = module.servicesvpc.private_subnet_ids
  security_group_id    = module.security.ecs_services_security_group_id
  execution_role_arn   = module.iam.ecs_execution_role_arn
  task_role_arn        = module.iam.web_task_role_arn
  enable_load_balancer = var.enable_alb
  target_group_arn     = var.enable_alb ? module.alb_app[0].web_target_group_arn : null
  image                = var.images.web
  tags                 = local.tags

  # Ensure the target group is associated with a load balancer before ECS service creation.
  depends_on = [module.alb_app]
}

locals {
  api_db_host                       = var.api_database_provider == "rds" ? module.postgres.endpoints[var.api_database_env] : null
  api_db_port                       = var.api_database_provider == "rds" ? module.postgres.ports[var.api_database_env] : 5432
  api_db_name                       = var.api_database_provider == "rds" ? "pytholit_${var.api_database_env}" : null
  api_db_credentials_secret_arn     = var.api_database_provider == "rds" ? (var.api_database_env == "prod" ? module.secrets.db_prod_secret_arn : module.secrets.db_dev_secret_arn) : null
  api_supabase_db_secret_arn        = var.api_database_provider == "supabase" ? module.secrets.supabase_prod_secret_arn : null
  api_supabase_direct_db_secret_arn = var.api_database_provider == "supabase" && var.api_supabase_direct_url_enabled ? module.secrets.supabase_prod_direct_secret_arn : null
}

module "ecs_api" {
  source                        = "./ecs/api"
  cluster_arn                   = module.ecs_shared.cluster_arn
  cluster_name                  = module.ecs_shared.cluster_name
  private_subnet_ids            = module.servicesvpc.private_subnet_ids
  security_group_id             = module.security.ecs_services_security_group_id
  execution_role_arn            = module.iam.ecs_execution_role_arn
  task_role_arn                 = module.iam.api_task_role_arn
  frontend_url                  = "https://${local.app_domain_name}"
  cookie_domain                 = ".${var.domain_name}"
  upload_dir                    = "uploads"
  node_env                      = "production"
  redis_url                     = module.elasticache.redis_url
  jwt_secret_arn                = module.secrets.jwt_secret_arn
  env_session_secret_arn        = module.secrets.env_session_secret_arn
  turnstile_secret_arn          = var.api_database_env == "prod" ? module.secrets.turnstile_secret_prod_arn : module.secrets.turnstile_secret_dev_arn
  zeptomail_api_key_arn         = module.secrets.zeptomail_api_key_arn
  github_client_id_arn          = var.api_database_env == "prod" ? module.secrets.github_client_id_prod_arn : module.secrets.github_client_id_dev_arn
  github_client_secret_arn      = var.api_database_env == "prod" ? module.secrets.github_client_secret_prod_arn : module.secrets.github_client_secret_dev_arn
  google_client_id_arn          = module.secrets.google_client_id_arn
  google_client_secret_arn      = module.secrets.google_client_secret_arn
  db_host                       = local.api_db_host
  db_port                       = local.api_db_port
  db_name                       = local.api_db_name
  db_credentials_secret_arn     = local.api_db_credentials_secret_arn
  supabase_db_secret_arn        = local.api_supabase_db_secret_arn
  supabase_direct_db_secret_arn = local.api_supabase_direct_db_secret_arn
  enable_load_balancer          = var.enable_alb
  target_group_arn              = var.enable_alb ? module.alb_app[0].api_target_group_arn : null
  image                         = var.images.api
  internal_secret               = var.orchestrator_internal_secret
  storage_driver                = "s3"
  s3_bucket                     = aws_s3_bucket.avatars.bucket
  s3_region                     = var.region
  s3_public_url                 = "https://${aws_s3_bucket.avatars.bucket}.s3.${var.region}.amazonaws.com"
  tags                          = local.tags

  depends_on = [module.alb_app, module.elasticache]
}

module "ecs_terminal_gateway" {
  source                 = "./ecs/terminal-gateway"
  cluster_arn            = module.ecs_shared.cluster_arn
  cluster_name           = module.ecs_shared.cluster_name
  private_subnet_ids     = module.servicesvpc.private_subnet_ids
  security_group_id      = module.security.ecs_services_security_group_id
  execution_role_arn     = module.iam.ecs_execution_role_arn
  task_role_arn          = module.iam.terminal_task_role_arn
  env_session_secret_arn = module.secrets.env_session_secret_arn
  enable_load_balancer   = var.enable_alb
  target_group_arn       = var.enable_alb ? module.alb_app[0].terminal_target_group_arn : null
  image                  = var.images.terminal_gateway
  tags                   = local.tags

  depends_on = [module.alb_app]
}

module "ecs_ingress_router" {
  source                 = "./ecs/ingress-router"
  cluster_arn            = module.ecs_shared.cluster_arn
  cluster_name           = module.ecs_shared.cluster_name
  private_subnet_ids     = module.servicesvpc.private_subnet_ids
  security_group_id      = module.security.ecs_services_security_group_id
  execution_role_arn     = module.iam.ecs_execution_role_arn
  task_role_arn          = module.iam.ingress_task_role_arn
  env_session_secret_arn = module.secrets.env_session_secret_arn
  enable_load_balancer   = var.enable_alb
  target_group_arn       = var.enable_alb ? module.alb_env[0].ingress_target_group_arn : null
  image                  = var.images.ingress_router
  tags                   = local.tags

  depends_on = [module.alb_env]
}

