# OAuth Setup Guide

Complete guide for setting up Google and GitHub OAuth authentication for Pytholit.

---

## 📋 Prerequisites

- AWS CLI configured with proper credentials
- Access to Google Cloud Console
- Access to GitHub account (with permission to create OAuth apps)
- Terraform infrastructure already deployed

---

## Part 1: Create OAuth Applications

### 🔵 Google OAuth Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown (top left)
3. Click **"New Project"**
4. **Project name**: `Pytholit` or `Pytholit Production`
5. Click **"Create"**

#### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services → OAuth consent screen**
2. **User Type**: Select **"External"**
3. Click **"Create"**

**App Information**:
```
App name: Pytholit
User support email: your-email@gmail.com
App logo: (optional)
Application home page: https://pytholit.dev
Application privacy policy: https://pytholit.dev/privacy
Application terms of service: https://pytholit.dev/terms
Developer contact email: your-email@gmail.com
```

**Scopes**:
- Click **"Add or Remove Scopes"**
- Select:
  - ✅ `.../auth/userinfo.email`
  - ✅ `.../auth/userinfo.profile`  - ✅ `openid`
- Click **"Update"**
- Click **"Save and Continue"**

**Test Users** (for development):
- Add your Gmail address for testing
- Click **"Save and Continue"**

**Summary**: Click **"Back to Dashboard"**

#### Step 3: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services → Credentials**
2. Click **"Create Credentials" → "OAuth client ID"**
3. **Application type**: Web application
4. **Name**: `Pytholit Web App`

**Authorized JavaScript origins**:
```
https://pytholit.dev
https://dev.pytholit.dev
http://localhost:3000
```

**Authorized redirect URIs**:
```
https://api.pytholit.dev/api/v1/oauth/google/callback
https://api-dev.pytholit.dev/api/v1/oauth/google/callback
http://localhost:3001/api/v1/oauth/google/callback
```

5. Click **"Create"**

#### Step 4: Copy Credentials

You'll see a modal with your credentials:

```
Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
Client secret: GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT**: Copy both values - you'll need them for AWS Secrets Manager.

---

### 🐙 GitHub OAuth Setup

#### Step 1: Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Or: **Your Profile → Settings → Developer settings → OAuth Apps**
2. Click **"New OAuth App"**

**App Information**:
```
Application name: Pytholit
Homepage URL: https://pytholit.dev
Application description: Python coding platform for developers (optional)
Authorization callback URL: https://api.pytholit.dev/api/v1/oauth/github/callback
```

3. Click **"Register application"**

#### Step 2: Generate Client Secret

After creation:

1. You'll see **Client ID**: `Iv1.1234567890abcdef`
2. Click **"Generate a new client secret"**
3. **Client secret**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**⚠️ CRITICAL**: Copy the client secret immediately - GitHub won't show it again!

#### Step 3: (Optional) Create Development OAuth App

For local testing, create a separate app:

```
Application name: Pytholit Local
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3001/api/v1/oauth/github/callback
```

This keeps production and development credentials separate.

---

## Part 2: Store Credentials in AWS Secrets Manager

### Option 1: Automated Script (Recommended)

Run the automated setup script:

```bash
cd /Users/m7mdhka/Desktop/pytholit/pytholit-v2/infra/demo
./scripts/setup-oauth-secrets.sh
```

The script will:
1. Prompt for Google Client ID and Secret
2. Prompt for GitHub Client ID and Secret
3. Create 4 secrets in AWS Secrets Manager
4. Display a summary

**Example Output**:
```
======================================
OAuth Secrets Setup
======================================

Step 1: Google OAuth Credentials
--------------------------------

Get your credentials from: https://console.cloud.google.com/apis/credentials

Enter Google Client ID: 123456789-abc.apps.googleusercontent.com
Enter Google Client Secret (hidden): ********

✅ Google Client ID stored
✅ Google Client Secret stored

Step 2: GitHub OAuth Credentials
--------------------------------

Get your credentials from: https://github.com/settings/developers

Enter GitHub Client ID: Iv1.1234567890abcdef
Enter GitHub Client Secret (hidden): ********

✅ GitHub Client ID stored
✅ GitHub Client Secret stored

======================================
✅ All OAuth secrets created!
======================================
```

### Option 2: Manual AWS CLI Commands

If you prefer manual setup:

**Google Credentials**:
```bash
# Google Client ID
aws secretsmanager create-secret \
  --name "pytholit-demo/api/google-client-id" \
  --description "Google OAuth Client ID for production" \
  --secret-string "YOUR_GOOGLE_CLIENT_ID" \
  --region us-east-1

# Google Client Secret
aws secretsmanager create-secret \
  --name "pytholit-demo/api/google-client-secret" \
  --description "Google OAuth Client Secret for production" \
  --secret-string "YOUR_GOOGLE_CLIENT_SECRET" \
  --region us-east-1
```

**GitHub Credentials**:
```bash
# GitHub Client ID
aws secretsmanager create-secret \
  --name "pytholit-demo/api/github-client-id" \
  --description "GitHub OAuth Client ID for production" \
  --secret-string "YOUR_GITHUB_CLIENT_ID" \
  --region us-east-1

# GitHub Client Secret
aws secretsmanager create-secret \
  --name "pytholit-demo/api/github-client-secret" \
  --description "GitHub OAuth Client Secret for production" \
  --secret-string "YOUR_GITHUB_CLIENT_SECRET" \
  --region us-east-1
```

---

## Part 3: Update Terraform to Inject Secrets

**Note**: This step is not yet implemented. The secrets exist in AWS but need to be wired through Terraform.

**TODO**: Update `infra/demo/secrets/main.tf` to reference existing secrets and pass them to ECS.

---

## Part 4: Verify Secrets

Check that all secrets were created:

```bash
aws secretsmanager list-secrets --region us-east-1 | grep pytholit-demo
```

**Expected Output** (4 OAuth secrets + existing secrets):
```json
"Name": "pytholit-demo/api/google-client-id"
"Name": "pytholit-demo/api/google-client-secret"
"Name": "pytholit-demo/api/github-client-id"
"Name": "pytholit-demo/api/github-client-secret"
"Name": "pytholit-demo/api/jwt-secret"
"Name": "pytholit-demo/api/turnstile-secret-dev"
"Name": "pytholit-demo/api/turnstile-secret-prod"
"Name": "pytholit-demo/api/zeptomail-api-key"
"Name": "pytholit-demo/db/dev-postgres"
"Name": "pytholit-demo/db/prod-postgres"
"Name": "pytholit-demo/platform/env-session-secret"
"Name": "pytholit-demo/web/turnstile-site-key-dev"
"Name": "pytholit-demo/web/turnstile-site-key-prod"
```

---

## Part 5: Local Development Setup

For local testing, add to `apps/api/.env`:

```env
# Google OAuth (Local Development)
GOOGLE_CLIENT_ID=your-local-google-client-id
GOOGLE_CLIENT_SECRET=your-local-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/oauth/google/callback

# GitHub OAuth (Local Development)
GITHUB_CLIENT_ID=your-local-github-client-id
GITHUB_CLIENT_SECRET=your-local-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/v1/oauth/github/callback
```

**Tip**: Use separate OAuth apps for local development to avoid conflicts.

---

## 🔍 Troubleshooting

### Google OAuth Issues

**Error**: "redirect_uri_mismatch"
- **Solution**: Check that your redirect URI exactly matches what's in Google Cloud Console
- **Format**: `https://api.pytholit.dev/api/v1/oauth/google/callback`

**Error**: "access_denied"
- **Solution**: Make sure the user is added to "Test users" if app is in testing mode

### GitHub OAuth Issues

**Error**: "redirect_uri_mismatch"
- **Solution**: Verify the callback URL in GitHub OAuth app settings
- **Format**: `https://api.pytholit.dev/api/v1/oauth/github/callback`

**Error**: "bad_verification_code"
- **Solution**: OAuth code already used or expired (codes are single-use, 60s TTL)

### AWS Secrets Manager Issues

**View Secret Value**:
```bash
aws secretsmanager get-secret-value --secret-id pytholit-demo/api/google-client-id --region us-east-1
```

**Update Secret Value**:
```bash
aws secretsmanager put-secret-value \
  --secret-id pytholit-demo/api/google-client-id \
  --secret-string "NEW_VALUE" \
  --region us-east-1
```

**Delete Secret** (if needed):
```bash
aws secretsmanager delete-secret \
  --secret-id pytholit-demo/api/google-client-id \
  --region us-east-1 \
  --force-delete-without-recovery
```

---

## 📊 Summary

**Secrets Created**:
| Secret Name | Purpose | Where Used |
|-------------|---------|------------|
| `pytholit-demo/api/google-client-id` | Google OAuth Client ID | ECS API Container |
| `pytholit-demo/api/google-client-secret` | Google OAuth Secret | ECS API Container |
| `pytholit-demo/api/github-client-id` | GitHub OAuth Client ID | ECS API Container |
| `pytholit-demo/api/github-client-secret` | GitHub OAuth Secret | ECS API Container |

**OAuth Flow**:
1. User clicks "Sign in with Google/GitHub"
2. Redirected to OAuth provider
3. User approves access
4. Redirected back to `https://api.pytholit.dev/api/v1/oauth/{provider}/callback`
5. API exchanges auth code for user profile
6. User logged in with JWT token

**Security**:
- ✅ Secrets stored in AWS Secrets Manager (encrypted at rest)
- ✅ IAM role limits access to ECS tasks only
- ✅ OAuth codes are single-use, 60-second TTL
- ✅ State tokens prevent CSRF attacks
- ✅ Redis ensures consistency across multi-instance deployments

---

## 🚀 Next Steps

After setting up OAuth:
1. ✅ Secrets created in AWS Secrets Manager
2. ⏳ **TODO**: Wire secrets through Terraform to ECS
3. ⏳ **TODO**: Redeploy ECS tasks to pick up new environment variables
4. ✅ Test OAuth flow in production

**Questions?** Check the API logs in CloudWatch:
```bash
aws logs tail /ecs/demo-api --follow --region us-east-1
```
