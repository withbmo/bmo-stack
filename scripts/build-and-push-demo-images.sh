#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:=us-east-1}"
: "${IMAGE_TAG:=demo-$(date +%Y%m%d%H%M%S)}"
: "${DEPLOY_ENV:=dev}"  # default to dev if not set
: "${DOMAIN_NAME:=pytholit.dev}"
: "${APP_DOMAIN_PREFIX:=}"
: "${NEXT_PUBLIC_API_URL:=}"
: "${NEXT_PUBLIC_APP_ENV:=}"

if [[ "$DEPLOY_ENV" == "dev" && "$APP_DOMAIN_PREFIX" == "" ]]; then
  APP_DOMAIN_PREFIX="dev"
fi

if [[ -z "${APP_DOMAIN_NAME:-}" ]]; then
  if [[ "$APP_DOMAIN_PREFIX" != "" ]]; then
    APP_DOMAIN_NAME="${APP_DOMAIN_PREFIX}.${DOMAIN_NAME}"
  else
    APP_DOMAIN_NAME="${DOMAIN_NAME}"
  fi
fi

if [[ "$NEXT_PUBLIC_API_URL" == "" ]]; then
  NEXT_PUBLIC_API_URL="https://api.${APP_DOMAIN_NAME}"
fi

if [[ "$NEXT_PUBLIC_APP_ENV" == "" ]]; then
  if [[ "$DEPLOY_ENV" == "prod" ]]; then
    NEXT_PUBLIC_APP_ENV="production"
  else
    NEXT_PUBLIC_APP_ENV="development"
  fi
fi

services=(
  "web:docker/web.Dockerfile"
  "api:docker/api.Dockerfile"
  "ingress-router:docker/ingress-router.Dockerfile"
  "env-orchestrator:docker/env-orchestrator.Dockerfile"
  "terminal-gateway:docker/terminal-gateway.Dockerfile"
)

if [[ -z "${ECR_REGISTRY:-}" ]]; then
  account_id="$(aws sts get-caller-identity --query Account --output text)"
  ECR_REGISTRY="${account_id}.dkr.ecr.${AWS_REGION}.amazonaws.com"
fi

echo "Using ECR registry: $ECR_REGISTRY"
echo "Deploy environment: $DEPLOY_ENV"

# Fetch Turnstile site key from Secrets Manager for web builds
if [[ "$DEPLOY_ENV" == "prod" ]]; then
  turnstile_site_key_secret="pytholit-demo/web/turnstile-site-key-prod"
else
  turnstile_site_key_secret="pytholit-demo/web/turnstile-site-key-dev"
fi

echo "Fetching Turnstile site key from $turnstile_site_key_secret..."
TURNSTILE_SITE_KEY="$(aws secretsmanager get-secret-value \
  --region "$AWS_REGION" \
  --secret-id "$turnstile_site_key_secret" \
  --query SecretString --output text)"

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

for entry in "${services[@]}"; do
  name="${entry%%:*}"
  dockerfile="${entry##*:}"
  repo="$ECR_REGISTRY/$name"

  if ! aws ecr describe-repositories --region "$AWS_REGION" --repository-names "$name" >/dev/null 2>&1; then
    echo "Creating ECR repository: $name"
    aws ecr create-repository \
      --region "$AWS_REGION" \
      --repository-name "$name" \
      --image-tag-mutability IMMUTABLE \
      --image-scanning-configuration scanOnPush=true >/dev/null
  fi

  echo "Building $name -> $repo:$IMAGE_TAG"

  # Build web image with Turnstile site key as build arg
  if [[ "$name" == "web" ]]; then
    docker build \
      -f "$dockerfile" \
      --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY="$TURNSTILE_SITE_KEY" \
      --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
      --build-arg NEXT_PUBLIC_APP_ENV="$NEXT_PUBLIC_APP_ENV" \
      -t "$repo:$IMAGE_TAG" .
  else
    docker build -f "$dockerfile" -t "$repo:$IMAGE_TAG" .
  fi

  docker push "$repo:$IMAGE_TAG"

done

echo "Pushed image tag: $IMAGE_TAG"
