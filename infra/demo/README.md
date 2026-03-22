# Demo Infra

This stack provisions the demo baseline for:
- ServicesVPC + EnvsVPC + TGW
- ECS Fargate services (web/api/orchestrator)
- Env VM substrate
- DynamoDB routing table
- ALBs + ACM + external DNS outputs (GoDaddy-managed zone)

## Bootstrap

1. `cd infra/bootstrap`
2. `terraform init`
3. `terraform apply -var='state_bucket_name=<unique-bucket-name>'`

## Demo stack

1. `cd infra/demo`
2. Configure backend:

```hcl
bucket         = "<from bootstrap output>"
key            = "demo/terraform.tfstate"
region         = "us-east-1"
dynamodb_table = "<from bootstrap output>"
encrypt        = true
```

3. `terraform init && terraform plan`
