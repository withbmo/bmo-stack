#!/usr/bin/env bash
set -euo pipefail

: "${AWS_REGION:=us-east-1}"
: "${IMAGE_TAG:=demo-$(date +%Y%m%d%H%M%S)}"

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
  docker build -f "$dockerfile" -t "$repo:$IMAGE_TAG" .
  docker push "$repo:$IMAGE_TAG"

done

echo "Pushed image tag: $IMAGE_TAG"
