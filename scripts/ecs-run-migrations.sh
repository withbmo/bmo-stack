#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 4 ]]; then
  echo "Usage: $0 <cluster_name> <service_name> [container_name] [schema_path]" >&2
  echo "Example: $0 demo-services-cluster demo-api api packages/db/prisma/schema.prisma" >&2
  exit 2
fi

cluster_name="$1"
service_name="$2"
container_name="${3:-api}"
schema_path="${4:-packages/db/prisma/schema.prisma}"

task_definition_arn="$(
  aws ecs describe-services \
    --cluster "$cluster_name" \
    --services "$service_name" \
    --query "services[0].taskDefinition" \
    --output text
)"

if [[ -z "$task_definition_arn" || "$task_definition_arn" == "None" ]]; then
  echo "Failed to resolve task definition from service '$service_name'." >&2
  exit 1
fi

read -r -a subnets <<<"$(
  aws ecs describe-services \
    --cluster "$cluster_name" \
    --services "$service_name" \
    --query "services[0].networkConfiguration.awsvpcConfiguration.subnets[]" \
    --output text
)"

read -r -a security_groups <<<"$(
  aws ecs describe-services \
    --cluster "$cluster_name" \
    --services "$service_name" \
    --query "services[0].networkConfiguration.awsvpcConfiguration.securityGroups[]" \
    --output text
)"

assign_public_ip="$(
  aws ecs describe-services \
    --cluster "$cluster_name" \
    --services "$service_name" \
    --query "services[0].networkConfiguration.awsvpcConfiguration.assignPublicIp" \
    --output text
)"

if [[ ${#subnets[@]} -eq 0 || ${#security_groups[@]} -eq 0 ]]; then
  echo "Missing awsvpc network config for service '$service_name'." >&2
  exit 1
fi

subnets_csv="$(IFS=,; echo "${subnets[*]}")"
security_groups_csv="$(IFS=,; echo "${security_groups[*]}")"

network_config="awsvpcConfiguration={subnets=[${subnets_csv}],securityGroups=[${security_groups_csv}],assignPublicIp=${assign_public_ip}}"

tmp_overrides="$(mktemp)"
cleanup() {
  rm -f "$tmp_overrides"
}
trap cleanup EXIT

run_cmd="set -euo pipefail; DATABASE_URL=\$(node -e 'const enc=encodeURIComponent; const host=process.env.DB_DIRECT_HOST || process.env.DB_HOST; const port=process.env.DB_DIRECT_PORT || process.env.DB_PORT || \"5432\"; const user=process.env.DB_USERNAME; const pass=process.env.DB_PASSWORD; const db=process.env.DB_NAME; const ssl=process.env.DB_SSLMODE || \"require\"; if(!host||!user||!pass||!db) process.exit(2); const params=new URLSearchParams({schema:\"public\", sslmode: ssl}); process.stdout.write(\"postgresql://\"+enc(user)+\":\"+enc(pass)+\"@\"+host+\":\"+port+\"/\"+db+\"?\"+params.toString());'); export DATABASE_URL; echo 'Running prisma migrate deploy...'; ./packages/db/node_modules/.bin/prisma migrate deploy --schema ${schema_path}"

jq -n \
  --arg name "$container_name" \
  --arg cmd "$run_cmd" \
  '{containerOverrides:[{name:$name,command:["sh","-lc",$cmd]}]}' >"$tmp_overrides"

task_arn="$(
  aws ecs run-task \
    --cluster "$cluster_name" \
    --launch-type FARGATE \
    --task-definition "$task_definition_arn" \
    --network-configuration "$network_config" \
    --started-by prisma-migrate \
    --overrides "file://${tmp_overrides}" \
    --query "tasks[0].taskArn" \
    --output text
)"

if [[ -z "$task_arn" || "$task_arn" == "None" ]]; then
  echo "Failed to start migration task." >&2
  exit 1
fi

echo "Started migration task: $task_arn"
aws ecs wait tasks-stopped --cluster "$cluster_name" --tasks "$task_arn"

exit_code="$(
  aws ecs describe-tasks \
    --cluster "$cluster_name" \
    --tasks "$task_arn" \
    --query "tasks[0].containers[?name==\`${container_name}\`].exitCode | [0]" \
    --output text
)"

if [[ "$exit_code" != "0" ]]; then
  echo "Migration task failed (exitCode=$exit_code). Task: $task_arn" >&2
  log_group="$(
    aws ecs describe-task-definition \
      --task-definition "$task_definition_arn" \
      --query "taskDefinition.containerDefinitions[?name==\`${container_name}\`].logConfiguration.options.\"awslogs-group\" | [0]" \
      --output text
  )"
  log_prefix="$(
    aws ecs describe-task-definition \
      --task-definition "$task_definition_arn" \
      --query "taskDefinition.containerDefinitions[?name==\`${container_name}\`].logConfiguration.options.\"awslogs-stream-prefix\" | [0]" \
      --output text
  )"
  if [[ -n "$log_group" && "$log_group" != "None" && -n "$log_prefix" && "$log_prefix" != "None" ]]; then
    stream="${log_prefix}/${container_name}/${task_arn##*/}"
    echo "Last logs ($log_group :: $stream):" >&2
    aws logs get-log-events --log-group-name "$log_group" --log-stream-name "$stream" --limit 200 --query "events[].message" --output text >&2 || true
  fi
  exit 1
fi

echo "Migrations applied successfully."
