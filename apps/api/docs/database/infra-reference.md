# Infra Reference

## New production stack

The new production-focused Terraform entry point is:

- [infra/prod](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod)

Its current purpose is intentionally limited to Supabase production database secret management.

## Files

### [infra/prod/main.tf](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod/main.tf)

Creates:

- runtime Supabase secret
- optional direct migration secret

### [infra/prod/variables.tf](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod/variables.tf)

Defines:

- region
- project name
- environment
- tags

### [infra/prod/outputs.tf](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod/outputs.tf)

Exposes:

- secret ARNs
- secret names

### [infra/prod/backend.tf](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod/backend.tf)

Configures Terraform remote state storage for the production stack.

### [infra/prod/README.md](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/prod/README.md)

Documents:

- what the stack creates
- expected secret payloads
- how to apply the stack

## Legacy demo infra

The older [infra/demo](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/demo) stack still contains broader infrastructure and older database assumptions.

For production database direction, prefer the new `infra/prod` stack as the source of truth for Supabase integration going forward.
