#!/bin/bash
set -e

# ==============================================================================
# Multi-Environment OAuth Secrets Setup Script
# ==============================================================================
# This script creates AWS Secrets Manager secrets for OAuth credentials
# Supports both single-app and multi-app strategies
#
# Usage:
#   ./scripts/setup-oauth-secrets-multi-env.sh
#
# Prerequisites:
#   - AWS CLI configured with proper credentials
#   - OAuth apps created in Google and GitHub
# ==============================================================================

REGION="us-east-1"
PROJECT_NAME="pytholit-demo"

echo "======================================"
echo "OAuth Secrets Setup (Multi-Environment)"
echo "======================================"
echo ""

# Ask user about their OAuth app strategy
echo "Which OAuth app strategy are you using?"
echo "  1) Single apps with multiple callbacks (Recommended - Simpler)"
echo "  2) Separate apps for each environment (More secure)"
echo ""
read -p "Enter choice (1 or 2): " STRATEGY

if [ "$STRATEGY" != "1" ] && [ "$STRATEGY" != "2" ]; then
  echo "❌ Invalid choice. Exiting."
  exit 1
fi

# ==============================================================================
# Google OAuth Credentials
# ==============================================================================
echo ""
echo "======================================"
echo "Google OAuth Credentials"
echo "======================================"
echo ""

if [ "$STRATEGY" = "1" ]; then
  echo "Strategy: Single Google OAuth app with multiple callbacks"
  echo ""
  echo "Authorized redirect URIs should include:"
  echo "  - https://api.pytholit.dev/api/v1/oauth/google/callback"
  echo "  - https://api-dev.pytholit.dev/api/v1/oauth/google/callback"
  echo "  - http://localhost:3001/api/v1/oauth/google/callback"
  echo ""

  read -p "Enter Google Client ID: " GOOGLE_CLIENT_ID
  read -sp "Enter Google Client Secret (hidden): " GOOGLE_CLIENT_SECRET
  echo ""
  echo ""

  if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Google credentials cannot be empty. Exiting."
    exit 1
  fi

  # Create secrets (same for both prod and dev)
  echo "Creating Google Client ID secret (shared)..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/google-client-id" \
    --description "Google OAuth Client ID (shared across environments)" \
    --secret-string "$GOOGLE_CLIENT_ID" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=shared \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/google-client-id" \
    --secret-string "$GOOGLE_CLIENT_ID" \
    --region $REGION

  echo "✅ Google Client ID stored (shared)"

  echo "Creating Google Client Secret (shared)..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/google-client-secret" \
    --description "Google OAuth Client Secret (shared across environments)" \
    --secret-string "$GOOGLE_CLIENT_SECRET" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=shared \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/google-client-secret" \
    --secret-string "$GOOGLE_CLIENT_SECRET" \
    --region $REGION

  echo "✅ Google Client Secret stored (shared)"

else
  echo "Strategy: Separate Google OAuth apps"
  echo ""

  # Production Google
  echo "--- Production Google App ---"
  echo "Callback: https://api.pytholit.dev/api/v1/oauth/google/callback"
  read -p "Enter Production Google Client ID: " GOOGLE_PROD_CLIENT_ID
  read -sp "Enter Production Google Client Secret (hidden): " GOOGLE_PROD_CLIENT_SECRET
  echo ""

  # Development Google
  echo ""
  echo "--- Development Google App ---"
  echo "Callback: https://api-dev.pytholit.dev/api/v1/oauth/google/callback"
  read -p "Enter Development Google Client ID: " GOOGLE_DEV_CLIENT_ID
  read -sp "Enter Development Google Client Secret (hidden): " GOOGLE_DEV_CLIENT_SECRET
  echo ""
  echo ""

  # Create production secrets
  echo "Creating Production Google secrets..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/google-client-id-prod" \
    --description "Google OAuth Client ID for production" \
    --secret-string "$GOOGLE_PROD_CLIENT_ID" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=prod \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/google-client-id-prod" \
    --secret-string "$GOOGLE_PROD_CLIENT_ID" \
    --region $REGION

  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/google-client-secret-prod" \
    --description "Google OAuth Client Secret for production" \
    --secret-string "$GOOGLE_PROD_CLIENT_SECRET" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=prod \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/google-client-secret-prod" \
    --secret-string "$GOOGLE_PROD_CLIENT_SECRET" \
    --region $REGION

  echo "✅ Production Google secrets stored"

  # Create development secrets
  echo "Creating Development Google secrets..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/google-client-id-dev" \
    --description "Google OAuth Client ID for development" \
    --secret-string "$GOOGLE_DEV_CLIENT_ID" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=dev \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/google-client-id-dev" \
    --secret-string "$GOOGLE_DEV_CLIENT_ID" \
    --region $REGION

  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/google-client-secret-dev" \
    --description "Google OAuth Client Secret for development" \
    --secret-string "$GOOGLE_DEV_CLIENT_SECRET" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=dev \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/google-client-secret-dev" \
    --secret-string "$GOOGLE_DEV_CLIENT_SECRET" \
    --region $REGION

  echo "✅ Development Google secrets stored"
fi

# ==============================================================================
# GitHub OAuth Credentials
# ==============================================================================
echo ""
echo "======================================"
echo "GitHub OAuth Credentials"
echo "======================================"
echo ""

if [ "$STRATEGY" = "1" ]; then
  echo "Strategy: Single GitHub OAuth app with multiple callbacks"
  echo ""
  echo "Create this in your GitHub Organization:"
  echo "  https://github.com/organizations/YOUR_ORG/settings/applications"
  echo ""
  echo "Authorization callback URLs should include:"
  echo "  - https://api.pytholit.dev/api/v1/oauth/github/callback"
  echo "  - https://api-dev.pytholit.dev/api/v1/oauth/github/callback"
  echo "  - http://localhost:3001/api/v1/oauth/github/callback"
  echo ""

  read -p "Enter GitHub Client ID: " GITHUB_CLIENT_ID
  read -sp "Enter GitHub Client Secret (hidden): " GITHUB_CLIENT_SECRET
  echo ""
  echo ""

  if [ -z "$GITHUB_CLIENT_ID" ] || [ -z "$GITHUB_CLIENT_SECRET" ]; then
    echo "❌ GitHub credentials cannot be empty. Exiting."
    exit 1
  fi

  # Create secrets (same for both prod and dev)
  echo "Creating GitHub Client ID secret (shared)..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/github-client-id" \
    --description "GitHub OAuth Client ID (shared across environments)" \
    --secret-string "$GITHUB_CLIENT_ID" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=shared \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/github-client-id" \
    --secret-string "$GITHUB_CLIENT_ID" \
    --region $REGION

  echo "✅ GitHub Client ID stored (shared)"

  echo "Creating GitHub Client Secret (shared)..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/github-client-secret" \
    --description "GitHub OAuth Client Secret (shared across environments)" \
    --secret-string "$GITHUB_CLIENT_SECRET" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=shared \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/github-client-secret" \
    --secret-string "$GITHUB_CLIENT_SECRET" \
    --region $REGION

  echo "✅ GitHub Client Secret stored (shared)"

else
  echo "Strategy: Separate GitHub OAuth apps"
  echo ""

  # Production GitHub
  echo "--- Production GitHub App ---"
  echo "Callback: https://api.pytholit.dev/api/v1/oauth/github/callback"
  read -p "Enter Production GitHub Client ID: " GITHUB_PROD_CLIENT_ID
  read -sp "Enter Production GitHub Client Secret (hidden): " GITHUB_PROD_CLIENT_SECRET
  echo ""

  # Development GitHub
  echo ""
  echo "--- Development GitHub App ---"
  echo "Callback: https://api-dev.pytholit.dev/api/v1/oauth/github/callback"
  read -p "Enter Development GitHub Client ID: " GITHUB_DEV_CLIENT_ID
  read -sp "Enter Development GitHub Client Secret (hidden): " GITHUB_DEV_CLIENT_SECRET
  echo ""
  echo ""

  # Create production secrets
  echo "Creating Production GitHub secrets..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/github-client-id-prod" \
    --description "GitHub OAuth Client ID for production" \
    --secret-string "$GITHUB_PROD_CLIENT_ID" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=prod \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/github-client-id-prod" \
    --secret-string "$GITHUB_PROD_CLIENT_ID" \
    --region $REGION

  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/github-client-secret-prod" \
    --description "GitHub OAuth Client Secret for production" \
    --secret-string "$GITHUB_PROD_CLIENT_SECRET" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=prod \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/github-client-secret-prod" \
    --secret-string "$GITHUB_PROD_CLIENT_SECRET" \
    --region $REGION

  echo "✅ Production GitHub secrets stored"

  # Create development secrets
  echo "Creating Development GitHub secrets..."
  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/github-client-id-dev" \
    --description "GitHub OAuth Client ID for development" \
    --secret-string "$GITHUB_DEV_CLIENT_ID" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=dev \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/github-client-id-dev" \
    --secret-string "$GITHUB_DEV_CLIENT_ID" \
    --region $REGION

  aws secretsmanager create-secret \
    --name "${PROJECT_NAME}/api/github-client-secret-dev" \
    --description "GitHub OAuth Client Secret for development" \
    --secret-string "$GITHUB_DEV_CLIENT_SECRET" \
    --region $REGION \
    --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=Environment,Value=dev \
    2>/dev/null || \
  aws secretsmanager put-secret-value \
    --secret-id "${PROJECT_NAME}/api/github-client-secret-dev" \
    --secret-string "$GITHUB_DEV_CLIENT_SECRET" \
    --region $REGION

  echo "✅ Development GitHub secrets stored"
fi

# ==============================================================================
# Summary
# ==============================================================================
echo ""
echo "======================================"
echo "✅ All OAuth secrets created!"
echo "======================================"
echo ""

if [ "$STRATEGY" = "1" ]; then
  echo "Secrets created (shared strategy):"
  echo "  - ${PROJECT_NAME}/api/google-client-id (shared)"
  echo "  - ${PROJECT_NAME}/api/google-client-secret (shared)"
  echo "  - ${PROJECT_NAME}/api/github-client-id (shared)"
  echo "  - ${PROJECT_NAME}/api/github-client-secret (shared)"
else
  echo "Secrets created (separate strategy):"
  echo "  Production:"
  echo "    - ${PROJECT_NAME}/api/google-client-id-prod"
  echo "    - ${PROJECT_NAME}/api/google-client-secret-prod"
  echo "    - ${PROJECT_NAME}/api/github-client-id-prod"
  echo "    - ${PROJECT_NAME}/api/github-client-secret-prod"
  echo ""
  echo "  Development:"
  echo "    - ${PROJECT_NAME}/api/google-client-id-dev"
  echo "    - ${PROJECT_NAME}/api/google-client-secret-dev"
  echo "    - ${PROJECT_NAME}/api/github-client-id-dev"
  echo "    - ${PROJECT_NAME}/api/github-client-secret-dev"
fi

echo ""
echo "Next steps:"
echo "  1. Update Terraform to inject these secrets into ECS"
echo "  2. Redeploy ECS tasks to pick up new secrets"
echo ""
echo "View all secrets:"
echo "  aws secretsmanager list-secrets --region $REGION | grep $PROJECT_NAME"
echo ""
