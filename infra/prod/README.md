# Prod Infra

This stack is the new production-focused Terraform entry point.

Its current scope is intentionally narrow:

- establish a dedicated `infra/prod` stack separate from `infra/demo`
- manage production Supabase database integration secrets
- provide a clean foundation for future production infrastructure

It does not provision the Supabase project itself. Supabase remains the managed PostgreSQL provider, and this stack manages the AWS-side secret contract used by the application.

## What this stack creates

- Secrets Manager secret for the production runtime database settings
- Secrets Manager secret for optional production direct-host migration settings

## Secret payloads

### Runtime secret

Secret name:

- `${project_name}/db/prod-supabase`

Expected JSON payload:

```json
{
  "host": "aws-0-us-east-1.pooler.supabase.com",
  "port": "6543",
  "dbname": "postgres",
  "username": "postgres.xxxxxxxx",
  "password": "your-password",
  "sslmode": "require"
}
```

### Direct migration secret

Secret name:

- `${project_name}/db/prod-supabase-direct`

Expected JSON payload:

```json
{
  "host": "db.xxxxxxxx.supabase.co",
  "port": "5432"
}
```

This second secret is optional and is only needed if production Prisma migrations should bypass the runtime host or pooler.

## Usage

1. Configure the backend in [backend.tf](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod/backend.tf) if needed.
2. Run:

```bash
cd infra/prod
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

3. Populate the secret values after apply:

```bash
aws secretsmanager put-secret-value \
  --secret-id "<runtime secret arn or name>" \
  --secret-string '{"host":"aws-0-us-east-1.pooler.supabase.com","port":"6543","dbname":"postgres","username":"postgres.xxxxxxxx","password":"your-password","sslmode":"require"}'
```

```bash
aws secretsmanager put-secret-value \
  --secret-id "<direct secret arn or name>" \
  --secret-string '{"host":"db.xxxxxxxx.supabase.co","port":"5432"}'
```

## Next step

Once you are happy with this contract, we can wire your future production ECS/API stack to these exact secrets and retire the old production database assumptions from `infra/demo`.
