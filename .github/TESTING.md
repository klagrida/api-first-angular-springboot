# Testing Strategy

This project has comprehensive test coverage at multiple levels, executed on every CI run.

## Test Levels

### 1. Backend Unit Tests
- **Location**: `backend/src/test/java/`
- **Framework**: JUnit 5, Spring Boot Test
- **Execution**: `mvn test`
- **CI Job**: `build-backend`
- **When**: Every push/PR
- **Coverage**: Business logic, service layer, repository layer

### 2. Frontend Unit Tests  
- **Location**: `frontend/src/app/`
- **Framework**: Jasmine, Karma
- **Execution**: `npm test`
- **CI Job**: `build-frontend`
- **When**: Every push/PR
- **Coverage**: Components, services, utilities

### 3. Integration Tests
- **Location**: CI workflow (curl-based API tests)
- **Framework**: Shell scripts with curl
- **CI Job**: `integration-tests`
- **When**: Every push/PR
- **Coverage**: REST API endpoints, HTTP contracts

### 4. E2E Tests
- **Location**: `frontend/e2e/`
- **Framework**: Playwright
- **Execution**: `npm run e2e`
- **CI Job**: `e2e-tests`
- **When**: Every push/PR
- **Coverage**: Complete user workflows, UI interactions, full stack integration

## Running Tests Locally

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
# Prerequisites: Backend and frontend must be running
cd frontend
npm run e2e          # Headless mode
npm run e2e:ui       # Interactive UI mode
npm run e2e:headed   # Headed browser mode
```

## CI/CD Test Execution

All tests run automatically on every push and pull request:

1. **Build Phase** (parallel)
   - Backend unit tests
   - Frontend unit tests

2. **Integration Phase** (parallel, after builds complete)
   - Integration tests (API contracts)
   - E2E tests (full user workflows)
   - Security scans

3. **Deploy Phase** (only if all tests pass)
   - Automatic deployment to staging

## Test Reports

Test results and reports are available as CI artifacts:
- Backend test results: `backend-test-results`
- Playwright HTML report: `playwright-report`
- Playwright test results: `playwright-test-results`

## Test Coverage

### E2E Test Scenarios (12 tests)
1. Display task manager interface
2. Create a new task
3. Edit an existing task
4. Complete a task
5. Undo task completion
6. Delete a task
7. Filter tasks by status (All/Active/Completed)
8. Refresh task list
9. Validate required fields
10. Cancel task creation
11. Close form by clicking overlay
12. Form data persistence during edit

All tests ensure:
- ✅ UI correctly reflects backend state
- ✅ API calls are properly formatted
- ✅ Error handling works as expected
- ✅ User interactions behave correctly
