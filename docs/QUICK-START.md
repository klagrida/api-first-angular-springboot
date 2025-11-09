# Quick Start Guide

Get the API-First Task Manager running in 5 minutes!

## Prerequisites Check

```bash
# Check Java (need 17+)
java -version

# Check Node.js (need 18+)
node -v

# Check Maven
mvn -v

# Check npm
npm -v
```

## Option 1: With Generated Code Already Committed (Fastest)

If generated code is already in the repository:

```bash
# 1. Start Backend
cd backend
mvn spring-boot:run

# 2. In another terminal, start Frontend
cd frontend
npm install
npm start
```

Done! Visit http://localhost:4200

## Option 2: Generate Code First

If starting fresh or generated code is not committed:

### Step 1: Generate API Code

```bash
# Backend generation
cd backend
mvn generate-sources

# Frontend generation
cd frontend
npm install
npm run generate-api
```

### Step 2: Start Backend

```bash
cd backend
mvn spring-boot:run
```

Wait until you see:
```
Started TaskManagerApplication in X seconds
```

### Step 3: Start Frontend

```bash
cd frontend
npm start
```

Wait until you see:
```
** Angular Live Development Server is listening on localhost:4200
```

### Step 4: Open Browser

Visit: http://localhost:4200

## Quick Commands Reference

### Backend

```bash
# Start backend
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package

# View API docs
# Open http://localhost:8080/swagger-ui.html

# View H2 console
# Open http://localhost:8080/h2-console
```

### Frontend

```bash
# Install dependencies
npm install

# Generate API client
npm run generate-api

# Start dev server
npm start

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### API

```bash
# Get all tasks
curl http://localhost:8080/api/v1/tasks

# Create a task
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Task","completed":false}'

# Get task by ID
curl http://localhost:8080/api/v1/tasks/1

# Update task
curl -X PUT http://localhost:8080/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","completed":true}'

# Delete task
curl -X DELETE http://localhost:8080/api/v1/tasks/1
```

## Troubleshooting

### Port 8080 already in use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Port 4200 already in use

```bash
# Kill existing Angular server
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4200 | xargs kill -9
```

### Generated code not found

```bash
# Regenerate backend
cd backend
mvn generate-sources

# Regenerate frontend
cd frontend
npm run generate-api
```

### Maven dependencies not downloading

```bash
# Clear Maven cache
mvn dependency:purge-local-repository

# Or delete .m2 folder
rm -rf ~/.m2/repository
```

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Useful URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4200 | Angular UI |
| Backend API | http://localhost:8080/api/v1 | REST endpoints |
| Swagger UI | http://localhost:8080/swagger-ui.html | API documentation |
| H2 Console | http://localhost:8080/h2-console | Database console |
| OpenAPI Spec | ./api/task-api.yaml | API contract |

## H2 Console Access

When accessing http://localhost:8080/h2-console:

- **JDBC URL**: `jdbc:h2:mem:taskdb`
- **Username**: `sa`
- **Password**: (leave empty)

## Project Structure Quick Reference

```
api_first_angular_springboot/
├── .github/workflows/ci-cd.yml     # CI/CD pipeline
├── api/task-api.yaml               # OpenAPI spec (SOURCE OF TRUTH)
├── backend/                        # Spring Boot
│   ├── pom.xml                    # Maven config
│   └── src/main/java/.../
│       ├── controller/            # REST endpoints
│       ├── service/               # Business logic
│       ├── repository/            # Data access
│       └── entity/                # JPA entities
├── frontend/                       # Angular
│   ├── package.json               # npm config
│   └── src/app/
│       ├── generated/             # Generated API client
│       ├── services/              # Custom services
│       └── components/            # UI components
└── openapitools.json              # Generator config
```

## Development Workflow

1. **Update API Contract**
   ```bash
   # Edit api/task-api.yaml
   vim api/task-api.yaml
   ```

2. **Regenerate Code**
   ```bash
   # Backend
   cd backend && mvn generate-sources

   # Frontend
   cd frontend && npm run generate-api
   ```

3. **Update Business Logic**
   ```bash
   # Edit backend services/controllers
   # Edit frontend services/components
   ```

4. **Test**
   ```bash
   # Backend
   cd backend && mvn test

   # Frontend
   cd frontend && npm test
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: add new endpoint"
   git push
   ```

6. **CI/CD runs automatically** 🚀

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [CI-CD-GUIDE.md](./CI-CD-GUIDE.md) for pipeline details
- Review [api-first-angular-springboot.md](./api-first-angular-springboot.md) for concepts

## Getting Help

- Check logs: `backend/logs/` or browser console
- Review OpenAPI spec: `api/task-api.yaml`
- Validate API: `npx @openapitools/openapi-generator-cli validate -i api/task-api.yaml`
- Test endpoints: Use Swagger UI at http://localhost:8080/swagger-ui.html

---

Happy coding! 🎉
