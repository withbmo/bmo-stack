# Docs

This folder documents **Pytholit v2** (app + infrastructure) with an emphasis on the **AWS demo platform** under `infra/demo/`.

## Core docs

- `architecture.md`: repo + runtime architecture (high-level)
- `development.md`: local development
- `deployment.md`: deployment overview (CI + Terraform), with links to demo specifics

## Billing

- `billing/README.md`: billing index (Stripe + subscriptions + entitlements)

## Demo platform (AWS)

The demo stack is designed to feel like a real platform:

- Web: `pytholit.dev`
- API: `api.pytholit.dev`
- Terminal gateway: `terminal.pytholit.dev`
- Per-environment URLs: `env-{envId}.dev.pytholit.dev` and `env-{envId}.prod.pytholit.dev`

Demo docs:

- `demo/overview.md`: what the demo provisions + how pieces connect
- `demo/terraform.md`: Terraform modules, key variables, and outputs
- `demo/user-environments.md`: how a user creates an environment, ownership/assignment, tokens
- `demo/routing.md`: hostnames → ALBs → ingress-router → TGW → env VMs (and current TODOs)
- `demo/deploy.md`: GitHub Actions deploy workflow, required AWS bootstrap, required secrets
- `demo/known-gaps.md`: what’s stubbed / not wired yet

