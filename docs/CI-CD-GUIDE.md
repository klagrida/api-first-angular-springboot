# CI/CD Pipeline Guide

This guide explains the complete CI/CD pipeline for the API-First Angular + Spring Boot project.

## Pipeline Overview

The pipeline consists of 7 jobs that run sequentially and in parallel:

```
┌─────────────────┐
│  Generate API   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Build │  │Build │
│Back  │  │Front │
└───┬──┘  └──┬───┘
    └────┬────┘
         │
    ┌────▼────┐
    │Integration│
    │  Tests   │
    └────┬─────┘
         │
    ┌────▼────┐
    │Security │
    │  Scan   │
    └────┬────┘
         │
    ┌────▼────┐
    │ Deploy  │
    └────┬────┘
         │
    ┌────▼────┐
    │ Notify  │
    └─────────┘
```

## Jobs Breakdown

### 1. Generate API Code

**Purpose**: Generate backend and frontend code from OpenAPI specification

**Steps**:
- ✅ Validates OpenAPI spec (`api/task-api.yaml`)
- ✅ Generates Spring Boot interfaces and models
- ✅ Generates Angular TypeScript client
- ✅ Commits generated code back to repository
- ✅ Uploads artifacts for downstream jobs

**Artifacts Created**:
- `backend-generated-code` - Java interfaces and models
- `frontend-generated-code` - TypeScript API client

**Why This Matters**:
- Ensures API contract is valid before building
- Keeps generated code in sync with specification
- Enables parallel backend/frontend development

### 2. Build & Test Backend

**Purpose**: Compile Spring Boot application and run unit tests

**Steps**:
- ✅ Downloads generated API code
- ✅ Compiles Java code with Maven
- ✅ Runs JUnit tests
- ✅ Generates code coverage report

**Artifacts Created**:
- `backend-jar` - Executable Spring Boot JAR
- `backend-test-results` - Test reports

**Success Criteria**:
- All tests pass
- Code compiles without errors
- Coverage threshold met (if configured)

### 3. Build & Test Frontend

**Purpose**: Compile Angular application and run unit tests

**Steps**:
- ✅ Downloads generated API code
- ✅ Installs npm dependencies
- ✅ Lints TypeScript code
- ✅ Builds production bundle
- ✅ Runs Karma/Jasmine tests

**Artifacts Created**:
- `frontend-dist` - Production-ready static files

**Success Criteria**:
- No linting errors
- Build completes successfully
- All tests pass

### 4. Integration Tests

**Purpose**: Test backend and frontend working together

**Steps**:
- ✅ Starts Spring Boot backend
- ✅ Runs health checks
- ✅ Tests API endpoints
- ✅ Validates request/response formats

**Test Coverage**:
- GET all tasks
- POST create task
- PUT update task
- DELETE task
- Error handling

### 5. Security Scan

**Purpose**: Identify security vulnerabilities

**Tools Used**:
- **Trivy**: Filesystem and dependency scanning
- **Maven Dependency Check**: Backend dependencies
- **npm audit**: Frontend dependencies

**Checks**:
- Known CVEs in dependencies
- Outdated packages
- Security misconfigurations
- OWASP Top 10 vulnerabilities

### 6. Deploy to Staging

**Purpose**: Deploy application to staging environment

**Conditions**:
- Only runs on `push` to `main` branch
- All previous jobs must succeed

**Deployment Options** (customize based on your infrastructure):

#### Option A: Heroku
```bash
# Backend
cd backend
heroku container:push web --app your-backend-app
heroku container:release web --app your-backend-app

# Frontend
cd frontend
heroku static:deploy
```

#### Option B: AWS
```bash
# Backend (Elastic Beanstalk)
aws elasticbeanstalk create-application-version \
  --application-name task-manager \
  --version-label ${{ github.sha }} \
  --source-bundle S3Bucket="your-bucket",S3Key="backend.jar"

# Frontend (S3 + CloudFront)
aws s3 sync frontend/dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Option C: Docker + Kubernetes
```bash
# Build and push images
docker build -t your-registry/backend:latest backend/
docker build -t your-registry/frontend:latest frontend/
docker push your-registry/backend:latest
docker push your-registry/frontend:latest

# Deploy to K8s
kubectl apply -f k8s/deployment.yaml
kubectl rollout status deployment/task-manager
```

### 7. Notification Summary

**Purpose**: Provide pipeline status summary

**Outputs**:
- Pipeline execution status
- Build artifacts URLs
- Deployment URLs
- Test coverage summary

## Triggering the Pipeline

### Automatic Triggers

1. **Push to main/develop**:
   ```bash
   git push origin main
   ```

2. **Pull Request**:
   ```bash
   gh pr create --title "Add new feature"
   ```

### Manual Trigger

Via GitHub UI:
1. Go to **Actions** tab
2. Select **API-First CI/CD Pipeline**
3. Click **Run workflow**
4. Choose branch and run

Via GitHub CLI:
```bash
gh workflow run ci-cd.yml
```

## Configuration

### Environment Variables

Edit in `.github/workflows/ci-cd.yml`:

```yaml
env:
  JAVA_VERSION: '17'        # Java version for backend
  NODE_VERSION: '20'        # Node.js version for frontend
  MAVEN_OPTS: -Xmx2048m     # Maven memory settings
```

### Secrets Required

Add these secrets in GitHub repository settings:

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `DEPLOY_TOKEN` | Deployment authentication | Deploy job |
| `DOCKER_USERNAME` | Docker Hub username | Docker deployment |
| `DOCKER_PASSWORD` | Docker Hub password | Docker deployment |
| `AWS_ACCESS_KEY_ID` | AWS access key | AWS deployment |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | AWS deployment |

### Customizing the Pipeline

#### Skip CI for Specific Commits

Add `[skip ci]` to commit message:
```bash
git commit -m "docs: update README [skip ci]"
```

#### Change Branch Triggers

Edit the `on` section:
```yaml
on:
  push:
    branches: [ main, develop, staging ]
  pull_request:
    branches: [ main ]
```

#### Add Environment-Specific Deploys

Add a new job:
```yaml
deploy-production:
  name: Deploy to Production
  runs-on: ubuntu-latest
  needs: deploy
  if: github.ref == 'refs/heads/main'
  environment: production
  steps:
    # Production deployment steps
```

## Generated Code Strategy

### Why Commit Generated Code?

The pipeline automatically commits generated API code because:

1. **Easier Onboarding**: New developers can clone and run immediately
2. **Clear Diffs**: PRs show exactly how API changes affect generated code
3. **Faster Builds**: No generation step needed locally
4. **Reproducibility**: Everyone works with identical generated code

### Skip Committing Generated Code

To regenerate on every build instead:

1. Uncomment lines in `.gitignore`:
   ```
   backend/target/generated-sources/
   frontend/src/app/generated/
   ```

2. Remove the "Commit and push generated code" step from workflow

3. Add generation to local build scripts

## Troubleshooting

### Pipeline Fails at "Generate API Code"

**Cause**: Invalid OpenAPI specification

**Solution**:
```bash
# Validate locally
npx @openapitools/openapi-generator-cli validate -i api/task-api.yaml

# Check YAML syntax
yamllint api/task-api.yaml
```

### Backend Tests Fail

**Cause**: Missing dependencies or database issues

**Solution**:
```bash
# Run tests locally
cd backend
mvn clean test

# Check H2 database configuration
cat src/main/resources/application.properties
```

### Frontend Build Fails

**Cause**: Missing generated code or TypeScript errors

**Solution**:
```bash
# Generate API client locally
cd frontend
npm run generate-api

# Check for TypeScript errors
npm run build
```

### Integration Tests Timeout

**Cause**: Backend takes too long to start

**Solution**: Increase sleep time in workflow:
```yaml
- name: Start Backend Server
  run: |
    java -jar backend.jar &
    sleep 60  # Increase from 30 to 60 seconds
```

### Security Scan Finds Vulnerabilities

**Solution**:
```bash
# Update backend dependencies
cd backend
mvn versions:use-latest-releases

# Update frontend dependencies
cd frontend
npm update
npm audit fix
```

## Performance Optimization

### Caching

The pipeline uses caching for:
- Maven dependencies (~80% faster builds)
- npm dependencies (~60% faster builds)
- Docker layers (if used)

### Parallel Execution

Backend and frontend jobs run in parallel, reducing total pipeline time by ~40%.

### Artifact Retention

Artifacts are kept for 7 days by default. Adjust in workflow:
```yaml
retention-days: 30  # Keep for 30 days
```

## Monitoring

### View Pipeline Status

```bash
# List recent workflow runs
gh run list

# View specific run details
gh run view <run-id>

# Watch run in real-time
gh run watch
```

### Download Artifacts

```bash
# List artifacts
gh run view <run-id>

# Download specific artifact
gh run download <run-id> -n backend-jar
```

## Best Practices

1. **Keep OpenAPI spec up to date**: All API changes must update `task-api.yaml` first
2. **Write tests**: Both backend and frontend should have comprehensive tests
3. **Review generated code PRs**: Automated commits should be reviewed
4. **Monitor security scans**: Address vulnerabilities promptly
5. **Test deployments**: Verify staging environment before production
6. **Use semantic versioning**: Tag releases appropriately

## Next Steps

1. **Set up deployment targets**: Configure Heroku/AWS/Docker credentials
2. **Add more tests**: Increase coverage with E2E tests
3. **Configure notifications**: Slack/Discord webhooks for build status
4. **Add performance testing**: Load tests for API endpoints
5. **Implement blue-green deployment**: Zero-downtime deployments

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Maven CI/CD Best Practices](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [Angular Deployment](https://angular.dev/tools/cli/deployment)
