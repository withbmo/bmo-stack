#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 4 ]]; then
  echo "Usage: $0 <cluster_name> <service_name> <container_name> <image_uri>"
  exit 2
fi

cluster_name="$1"
service_name="$2"
container_name="$3"
image_uri="$4"

current_td_arn="$(aws ecs describe-services \
  --cluster "$cluster_name" \
  --services "$service_name" \
  --query 'services[0].taskDefinition' \
  --output text)"

if [[ -z "$current_td_arn" || "$current_td_arn" == "None" ]]; then
  echo "Could not resolve current task definition for service: $service_name"
  exit 1
fi

current_image="$(aws ecs describe-task-definition \
  --task-definition "$current_td_arn" \
  --query "taskDefinition.containerDefinitions[?name=='$container_name'].image | [0]" \
  --output text)"

if [[ "$current_image" == "$image_uri" ]]; then
  echo "Service $service_name already uses image $image_uri (container $container_name). Skipping."
  exit 0
fi

td_json="$(aws ecs describe-task-definition \
  --task-definition "$current_td_arn" \
  --query 'taskDefinition' \
  --output json)"

# Register a new revision with only the image changed for the specified container.
new_td_json="$(jq \
  --arg container "$container_name" \
  --arg image "$image_uri" \
  '.
   | .containerDefinitions |= map(if .name == $container then (.image = $image) else . end)
   | del(
       .taskDefinitionArn,
       .revision,
       .status,
       .requiresAttributes,
       .compatibilities,
       .registeredAt,
       .registeredBy
     )' <<<"$td_json")"

new_td_arn="$(aws ecs register-task-definition \
  --cli-input-json "$new_td_json" \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)"

aws ecs update-service \
  --cluster "$cluster_name" \
  --service "$service_name" \
  --task-definition "$new_td_arn" >/dev/null

aws ecs wait services-stable --cluster "$cluster_name" --services "$service_name"

echo "Updated $service_name ($container_name):"
echo "  from: $current_image"
echo "  to:   $image_uri"
