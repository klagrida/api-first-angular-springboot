# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the API-First Task Manager project.

## Available Workflows

### `ci-cd.yml` - Main CI/CD Pipeline

**Trigger Events:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Pipeline Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     GENERATE API CODE                           │
│  • Validate OpenAPI spec                                        │
│  • Generate Spring Boot interfaces/models                       │
│  • Generate Angular TypeScript client                           │
│  • Commit generated code (skip ci)                              │
│  • Upload artifacts                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌───────────────────┐            ┌───────────────────┐
│  BUILD BACKEND    │            │  BUILD FRONTEND   │
│  • Download code  │            │  • Download code  │
│  • Maven compile  │            │  • npm install    │
│  • Run tests      │            │  • Lint code      │
│  • Coverage       │            │  • Build dist     │
│  • Upload JAR     │            │  • Run tests      │
└─────────┬─────────┘            └─────────┬─────────┘
          │                                │
          └────────────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ INTEGRATION TESTS    │
                │  • Start backend     │
                │  • Health checks     │
                │  • API endpoint tests│
                │  • Response validation│
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  SECURITY SCAN       │
                │  • Trivy scan        │
                │  • Dependency check  │
                │  • npm audit         │
                │  • SARIF upload      │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  DEPLOY (main only)  │
                │  • Deploy backend    │
                │  • Deploy frontend   │
                │  • Smoke tests       │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  NOTIFY SUMMARY      │
                │  • Pipeline status   │
                │  • Artifacts URLs    │
                │  • Deployment URLs   │
                └──────────────────────┘
```

## Job Details

### Job 1: Generate API Code
- **Duration**: ~2 minutes
- **Artifacts**: `backend-generated-code`, `frontend-generated-code`
- **Cache**: Maven, npm
- **Key Actions**:
  - Validates OpenAPI specification
  - Generates Spring Boot interfaces
  - Generates Angular services
  - Auto-commits if changes detected

### Job 2: Build Backend
- **Duration**: ~3 minutes
- **Artifacts**: `backend-jar`, `backend-test-results`
- **Dependencies**: generate-api
- **Key Actions**:
  - Maven clean package
  - JUnit tests
  - Code coverage

### Job 3: Build Frontend
- **Duration**: ~3 minutes
- **Artifacts**: `frontend-dist`
- **Dependencies**: generate-api
- **Key Actions**:
  - npm install
  - Linting
  - Production build
  - Karma tests

### Job 4: Integration Tests
- **Duration**: ~2 minutes
- **Dependencies**: build-backend, build-frontend
- **Key Actions**:
  - Start Spring Boot
  - Health checks
  - CRUD endpoint tests

### Job 5: Security Scan
- **Duration**: ~3 minutes
- **Dependencies**: build-backend, build-frontend
- **Key Actions**:
  - Trivy filesystem scan
  - Maven dependency-check
  - npm audit

### Job 6: Deploy
- **Duration**: ~5 minutes
- **Conditions**: Only on push to `main`
- **Dependencies**: integration-tests, security-scan
- **Key Actions**:
  - Deploy to staging
  - Post-deployment tests

### Job 7: Notify
- **Duration**: ~30 seconds
- **Conditions**: Always runs
- **Dependencies**: All previous jobs
- **Key Actions**:
  - Status summary
  - Artifact links

## Workflow Configuration

### Environment Variables

```yaml
JAVA_VERSION: '17'
NODE_VERSION: '20'
MAVEN_OPTS: -Xmx2048m
```

### Required Secrets

| Secret | Purpose | Required For |
|--------|---------|--------------|
| `GITHUB_TOKEN` | Auto-generated | All jobs |
| `DEPLOY_TOKEN` | Deployment auth | Deploy job |

### Optional Secrets

| Secret | Purpose | Usage |
|--------|---------|-------|
| `DOCKER_USERNAME` | Docker Hub | Container deployments |
| `DOCKER_PASSWORD` | Docker Hub | Container deployments |
| `AWS_ACCESS_KEY_ID` | AWS | AWS deployments |
| `AWS_SECRET_ACCESS_KEY` | AWS | AWS deployments |
| `SLACK_WEBHOOK` | Notifications | Slack alerts |

## Customization

### Change Trigger Branches

Edit `ci-cd.yml`:
```yaml
on:
  push:
    branches: [ main, develop, staging ]
```

### Skip CI

Add to commit message:
```bash
git commit -m "docs: update README [skip ci]"
```

### Manual Trigger

```bash
# Via GitHub CLI
gh workflow run ci-cd.yml

# Via API
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/ci-cd.yml/dispatches \
  -d '{"ref":"main"}'
```

### Add Environment Protection

In GitHub repository settings:
1. Go to **Settings** → **Environments**
2. Create `production` environment
3. Add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches

Then in workflow:
```yaml
deploy-production:
  environment: production
  # ... rest of job
```

## Monitoring

### View Logs

```bash
# List recent runs
gh run list --workflow=ci-cd.yml

# View specific run
gh run view 1234567890

# Download logs
gh run download 1234567890
```

### Pipeline Metrics

Average execution times:
- **Full pipeline**: ~15 minutes
- **PR validation**: ~10 minutes (no deploy)
- **With cache hits**: ~8 minutes

### Success Rate

Target: 95%+ success rate

Common failure causes:
1. Test failures (50%)
2. OpenAPI validation (20%)
3. Security vulnerabilities (15%)
4. Network issues (10%)
5. Other (5%)

## Best Practices

1. **Keep jobs fast**: Use caching, parallel execution
2. **Fail fast**: Run quick checks first (lint, validate)
3. **Retry flaky tests**: Use `continue-on-error` for non-critical steps
4. **Secure secrets**: Never log secrets, use masked values
5. **Clean artifacts**: Set appropriate retention periods
6. **Monitor costs**: GitHub Actions has usage limits

## Troubleshooting

### Workflow Not Triggering

**Check:**
- Branch name matches trigger pattern
- `.github/workflows/ci-cd.yml` exists in branch
- Workflow file has valid YAML syntax
- Repository has Actions enabled

### Job Fails with "Resource not accessible"

**Solution:**
- Check repository permissions
- Verify `GITHUB_TOKEN` has required scopes
- Ensure secrets are configured

### Generated Code Commit Fails

**Causes:**
- Branch protection rules
- Missing write permissions
- Conflict with existing changes

**Solution:**
```yaml
- name: Commit generated code
  run: |
    git config --local user.email "actions@github.com"
    git config --local user.name "GitHub Actions"
    git pull --rebase origin ${{ github.ref }}
    git add .
    git commit -m "chore: regenerate API [skip ci]" || exit 0
    git push
```

### Cache Not Working

**Solution:**
```bash
# Clear cache via API
gh api -X DELETE /repos/OWNER/REPO/actions/caches?key=maven-cache
```

## Cost Optimization

### Storage Costs

```yaml
# Reduce artifact retention
retention-days: 3  # Default: 7

# Delete artifacts after job
- name: Cleanup
  if: always()
  run: |
    gh api repos/{owner}/{repo}/actions/runs/{run_id}/artifacts \
      | jq -r '.artifacts[].id' \
      | xargs -I {} gh api -X DELETE repos/{owner}/{repo}/actions/artifacts/{}
```

### Compute Costs

```yaml
# Use smaller runners for light jobs
runs-on: ubuntu-latest-4-cores  # Instead of 8-cores

# Cancel outdated runs
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## Security

### SARIF Upload

Security scan results are uploaded to GitHub Security tab:

```yaml
- name: Upload Trivy Results
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: trivy-results.sarif
```

View at: `https://github.com/OWNER/REPO/security/code-scanning`

### Dependabot Integration

The workflow integrates with Dependabot:
- Auto-merge low-risk updates
- Create PRs for security fixes
- Run tests before merging

## Further Reading

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [CI/CD Best Practices](https://docs.github.com/en/actions/guides/about-continuous-integration)

---

For detailed pipeline documentation, see [CI-CD-GUIDE.md](../../CI-CD-GUIDE.md)
