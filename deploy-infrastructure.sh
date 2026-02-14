#!/bin/bash
# Simple one-command infrastructure deployment
# Run from project root: ./deploy-infrastructure.sh

set -e

echo "🚀 Pytholit Infrastructure Deployment"
echo "======================================"
echo ""

# Change to terraform directory
cd "$(dirname "$0")/infra/terraform"

# Set sensible defaults for development
export PROJECT_NAME="${PROJECT_NAME:-pytholit}"
export AWS_REGION="${AWS_REGION:-us-east-1}"
export PLATFORM_ENV="${PLATFORM_ENV:-platform-dev}"
export ENABLE_NAT="${ENABLE_NAT:-false}"
export ENABLE_ALB="${ENABLE_ALB:-false}"

echo "Configuration:"
echo "  Project: $PROJECT_NAME"
echo "  Region: $AWS_REGION"
echo "  Environment: $PLATFORM_ENV"
echo "  NAT Gateway: $ENABLE_NAT (saves ~\$30/month if false)"
echo "  Load Balancer: $ENABLE_ALB (saves ~\$20/month if false)"
echo ""
echo "To customize, set environment variables before running:"
echo "  export ENABLE_NAT=true   # Enable NAT for production"
echo "  export ENABLE_ALB=true   # Enable ALB for production"
echo "  ./deploy-infrastructure.sh"
echo ""

# Run deployment script
exec ./deploy.sh
