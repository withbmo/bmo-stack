#!/bin/bash
set -e

# ==============================================================================
# OAuth Secrets Setup Script
# ==============================================================================
# This script creates AWS Secrets Manager secrets for OAuth credentials
#
# Usage:
#   ./scripts/setup-oauth-secrets.sh
#
# Prerequisites:
#   - AWS CLI configured with proper credentials
#   - OAuth apps created in Google and GitHub
# ==============================================================================

REGION="us-east-1"
PROJECT_NAME="pytholit-demo"

echo "======================================"
echo "OAuth Secrets Setup"
echo "======================================"
echo ""

# ==============================================================================
# Google OAuth Credentials
# ==============================================================================
echo "Step 1: Google OAuth Credentials"
echo "--------------------------------"
echo ""
echo "Get your credentials from: https://console.cloud.google.com/apis/credentials"
echo ""
read -p "Enter Google Client ID: " GOOGLE_CLIENT_ID
read -sp "Enter Google Client Secret (hidden): " GOOGLE_CLIENT_SECRET
echo ""
echo ""

if [ -z "$GOOGLE_CLIENT_ID" ] || [ -z "$GOOGLE_CLIENT_SECRET" ]; then
  echo "❌ Google credentials cannot be empty. Exiting."
  exit 1
fi

# Create Google Client ID secret
echo "Creating Google Client ID secret..."
aws secretsmanager create-secret \
  --name "${PROJECT_NAME}/api/google-client-id" \
  --description "Google OAuth Client ID for production" \
  --secret-string "$GOOGLE_CLIENT_ID" \
  --region $REGION \
  --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=ManagedBy,Value=manual \
  2>/dev/null || \
aws secretsmanager put-secret-value \
  --secret-id "${PROJECT_NAME}/api/google-client-id" \
  --secret-string "$GOOGLE_CLIENT_ID" \
  --region $REGION

echo "✅ Google Client ID stored"

# Create Google Client Secret
echo "Creating Google Client Secret secret..."
aws secretsmanager create-secret \
  --name "${PROJECT_NAME}/api/google-client-secret" \
  --description "Google OAuth Client Secret for production" \
  --secret-string "$GOOGLE_CLIENT_SECRET" \
  --region $REGION \
  --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=ManagedBy,Value=manual \
  2>/dev/null || \
aws secretsmanager put-secret-value \
  --secret-id "${PROJECT_NAME}/api/google-client-secret" \
  --secret-string "$GOOGLE_CLIENT_SECRET" \
  --region $REGION

echo "✅ Google Client Secret stored"
echo ""

# ==============================================================================
# GitHub OAuth Credentials
# ==============================================================================
echo "Step 2: GitHub OAuth Credentials"
echo "--------------------------------"
echo ""
echo "Get your credentials from: https://github.com/settings/developers"
echo ""
read -p "Enter GitHub Client ID: " GITHUB_CLIENT_ID
read -sp "Enter GitHub Client Secret (hidden): " GITHUB_CLIENT_SECRET
echo ""
echo ""

if [ -z "$GITHUB_CLIENT_ID" ] || [ -z "$GITHUB_CLIENT_SECRET" ]; then
  echo "❌ GitHub credentials cannot be empty. Exiting."
  exit 1
fi

# Create GitHub Client ID secret
echo "Creating GitHub Client ID secret..."
aws secretsmanager create-secret \
  --name "${PROJECT_NAME}/api/github-client-id" \
  --description "GitHub OAuth Client ID for production" \
  --secret-string "$GITHUB_CLIENT_ID" \
  --region $REGION \
  --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=ManagedBy,Value=manual \
  2>/dev/null || \
aws secretsmanager put-secret-value \
  --secret-id "${PROJECT_NAME}/api/github-client-id" \
  --secret-string "$GITHUB_CLIENT_ID" \
  --region $REGION

echo "✅ GitHub Client ID stored"

# Create GitHub Client Secret
echo "Creating GitHub Client Secret secret..."
aws secretsmanager create-secret \
  --name "${PROJECT_NAME}/api/github-client-secret" \
  --description "GitHub OAuth Client Secret for production" \
  --secret-string "$GITHUB_CLIENT_SECRET" \
  --region $REGION \
  --tags Key=Project,Value=$PROJECT_NAME Key=Service,Value=oauth Key=ManagedBy,Value=manual \
  2>/dev/null || \
aws secretsmanager put-secret-value \
  --secret-id "${PROJECT_NAME}/api/github-client-secret" \
  --secret-string "$GITHUB_CLIENT_SECRET" \
  --region $REGION

echo "✅ GitHub Client Secret stored"
echo ""

# ==============================================================================
# Summary
# ==============================================================================
echo "======================================"
echo "✅ All OAuth secrets created!"
echo "======================================"
echo ""
echo "Secrets created:"
echo "  1. ${PROJECT_NAME}/api/google-client-id"
echo "  2. ${PROJECT_NAME}/api/google-client-secret"
echo "  3. ${PROJECT_NAME}/api/github-client-id"
echo "  4. ${PROJECT_NAME}/api/github-client-secret"
echo ""
echo "Next steps:"
echo "  1. Update Terraform to inject these secrets into ECS"
echo "  2. Redeploy ECS tasks to pick up new secrets"
echo ""
echo "View secrets:"
echo "  aws secretsmanager list-secrets --region $REGION | grep $PROJECT_NAME"
echo ""
