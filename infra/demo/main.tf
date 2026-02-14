module "servicesvpc" {
  source   = "./servicesvpc"
  vpc_cidr = var.services_vpc_cidr
  region   = var.region
  tags     = local.tags
}

module "envsvpc" {
  source   = "./envsvpc"
  vpc_cidr = var.envs_vpc_cidr
  region   = var.region
  tags     = local.tags
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
  tags                  = local.tags
}

module "secrets" {
  source       = "./secrets"
  project_name = var.project_name
  tags         = local.tags
}

module "iam" {
  source = "./iam"
  tags   = local.tags
  secret_arns = concat(
    [module.secrets.jwt_secret_arn, module.secrets.env_session_secret_arn],
    values(module.postgres.master_secret_arns)
  )
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

module "alb_app" {
  count = var.enable_alb ? 1 : 0

  source                = "./alb_app"
  vpc_id                = module.servicesvpc.vpc_id
  public_subnet_ids     = module.servicesvpc.public_subnet_ids
  alb_security_group_id = module.security.alb_app_security_group_id
  app_domain_name       = local.app_domain_name
  certificate_arn       = null
  tags                  = local.tags
}

module "alb_env" {
  count = var.enable_alb ? 1 : 0

  source                = "./alb_env"
  vpc_id                = module.servicesvpc.vpc_id
  public_subnet_ids     = module.servicesvpc.public_subnet_ids
  alb_security_group_id = module.security.alb_env_security_group_id
  certificate_arn       = null
  tags                  = local.tags
}

module "dns_acm" {
  count = var.enable_dns_acm ? 1 : 0

  source                         = "./dns_acm"
  domain_name                    = var.domain_name
  app_domain_name                = local.app_domain_name
  app_alb_dns_name               = var.enable_alb ? module.alb_app[0].alb_dns_name : ""
  env_alb_dns_name               = var.enable_alb ? module.alb_env[0].alb_dns_name : ""
  public_zone_managed_externally = var.public_zone_managed_externally
  tags                           = local.tags
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
}

module "ecs_api" {
  source                    = "./ecs/api"
  cluster_arn               = module.ecs_shared.cluster_arn
  cluster_name              = module.ecs_shared.cluster_name
  private_subnet_ids        = module.servicesvpc.private_subnet_ids
  security_group_id         = module.security.ecs_services_security_group_id
  execution_role_arn        = module.iam.ecs_execution_role_arn
  task_role_arn             = module.iam.api_task_role_arn
  jwt_secret_arn            = module.secrets.jwt_secret_arn
  env_session_secret_arn    = module.secrets.env_session_secret_arn
  db_host                   = module.postgres.endpoints[var.api_database_env]
  db_port                   = module.postgres.ports[var.api_database_env]
  db_name                   = "pytholit_${var.api_database_env}"
  db_credentials_secret_arn = module.postgres.master_secret_arns[var.api_database_env]
  enable_load_balancer      = var.enable_alb
  target_group_arn          = var.enable_alb ? module.alb_app[0].api_target_group_arn : null
  image                     = var.images.api
  tags                      = local.tags
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
}

module "ecs_orchestrator" {
  source             = "./ecs/orchestrator"
  cluster_arn        = module.ecs_shared.cluster_arn
  cluster_name       = module.ecs_shared.cluster_name
  private_subnet_ids = module.servicesvpc.private_subnet_ids
  security_group_id  = module.security.ecs_services_security_group_id
  execution_role_arn = module.iam.ecs_execution_role_arn
  task_role_arn      = module.iam.orchestrator_task_role_arn
  image              = var.images.orchestrator
  tags               = local.tags
}
