project_name      = "pytholit-demo"
domain_name       = "pytholit.dev"
app_domain_prefix = "dev"
api_database_env  = "dev"

# Keep false until AWS enables ALB creation for this account.
enable_alb      = true
enable_dns_acm  = true
manage_root_dns = true

# ZeptoMail DNS records (managed in Route53 root zone)
route53_extra_txt_records = [
  {
    name  = "57504._domainkey"
    value = "k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrbV4Ftn4mdjOH7vni5y++xUHXC7pG5LFKrdHND278A/16Il0A92IzaL+Cq3izYFAr9joyYPiaWPKECSPX5tuvagVyX66OYs1SMaMjXfzQKvjqzdETNZQz29YJ7wTQONhrRnTW5tW3MGwkRfZDXIp2JMx0XQibUpFUTzOCOvpvGQIDAQAB"
    ttl   = 300
  },
  {
    name  = "zmail._domainkey"
    value = "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxwNgcZ44Iqb/cplCQ/wrWral8YbyQaw+isAU86d9LJuy6HyMidTpAzcUoQrD5vd7DSnUEEgGn4+zX5tuIO/cqQqK7ykgfAfiz8PR6RZpwyqO2QvADzGfx/mfFx33PoMnDPkVAcSLT1azjjmtes675Suq+tP0+0+7dahcfVuNtxpyeoH/gLDVZGPbatRgV86YIQ99N3n7SGY3RSVS4fAQXEHHa4Nk9L7hwt0pWXU56poAlEsmSF8Qg3I1M5BfdqYOdQeh+0xzo2aPHAnO2E0eAf9llohYhhE5+h5ZmhncnOiw6Fj8U8PXdQbgEmTunGrP9SnWuE9QBUk/L8fCiw9YUwIDAQAB"
    ttl   = 300
  },
  {
    name  = "@"
    value = "v=spf1 include:zohomail.com ~all"
    ttl   = 300
  },
]

route53_extra_cname_records = [
  {
    name  = "bounce-zem"
    value = "cluster89.zeptomail.com"
    ttl   = 300
  },
]

route53_extra_mx_records = [
  # Zoho Mail inbound (domain apex)
  { name = "", priority = 10, value = "mx.zoho.com", ttl = 300 },
  { name = "", priority = 20, value = "mx2.zoho.com", ttl = 300 },
  { name = "", priority = 50, value = "mx3.zoho.com", ttl = 300 },
]

# Docker images
images = {
  web              = "public.ecr.aws/docker/library/nginx:stable"
  api              = "600161850626.dkr.ecr.us-east-1.amazonaws.com/api:demo-20260216072044"
  terminal_gateway = "public.ecr.aws/docker/library/nginx:stable"
  ingress_router   = "public.ecr.aws/docker/library/nginx:stable"
}
