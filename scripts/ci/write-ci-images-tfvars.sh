#!/usr/bin/env bash
set -euo pipefail

output_file="infra/demo/ci-images.auto.tfvars.json"
mode=""
registry=""
tag=""
cluster_name=""

usage() {
  echo "Usage:" >&2
  echo "  $0 --from-tag --registry <ecr_registry> --tag <image_tag> [--output <path>]" >&2
  echo "  $0 --from-ecs --cluster <cluster_name> [--output <path>]" >&2
  exit 2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --output)
      output_file="$2"
      shift 2
      ;;
    --from-tag)
      mode="tag"
      shift
      ;;
    --registry)
      registry="$2"
      shift 2
      ;;
    --tag)
      tag="$2"
      shift 2
      ;;
    --from-ecs)
      mode="ecs"
      shift
      ;;
    --cluster)
      cluster_name="$2"
      shift 2
      ;;
    *)
      usage
      ;;
  esac
done

if [[ "$mode" == "tag" ]]; then
  if [[ -z "$registry" || -z "$tag" ]]; then
    usage
  fi

  web="${registry}/web:${tag}"
  api="${registry}/api:${tag}"
  terminal_gateway="${registry}/terminal-gateway:${tag}"
  ingress_router="${registry}/ingress-router:${tag}"
elif [[ "$mode" == "ecs" ]]; then
  if [[ -z "$cluster_name" ]]; then
    usage
  fi

  resolve_image() {
    local service_name="$1"
    local container_name="$2"
    local td
    local image

    td="$(aws ecs describe-services --cluster "$cluster_name" --services "$service_name" --query 'services[0].taskDefinition' --output text)"
    if [[ -z "$td" || "$td" == "None" ]]; then
      echo "Failed to resolve task definition for service: $service_name" >&2
      exit 1
    fi

    image="$(aws ecs describe-task-definition --task-definition "$td" --query "taskDefinition.containerDefinitions[?name=='${container_name}'].image | [0]" --output text)"
    if [[ -z "$image" || "$image" == "None" ]]; then
      echo "Failed to resolve image for container '$container_name' in task definition '$td'." >&2
      exit 1
    fi

    echo "$image"
  }

  web="$(resolve_image demo-web web)"
  api="$(resolve_image demo-api api)"
  terminal_gateway="$(resolve_image demo-terminal-gateway terminal-gateway)"
  ingress_router="$(resolve_image demo-ingress-router ingress-router)"
else
  usage
fi

mkdir -p "$(dirname "$output_file")"

jq -n \
  --arg web "$web" \
  --arg api "$api" \
  --arg terminal_gateway "$terminal_gateway" \
  --arg ingress_router "$ingress_router" \
  '{images:{web:$web,api:$api,terminal_gateway:$terminal_gateway,ingress_router:$ingress_router}}' >"$output_file"

echo "Wrote $output_file"
