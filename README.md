# API-First Development: Task Manager Demo

This project demonstrates API-first development using Angular 20+ and Spring Boot. Complete documentation is available in the [`docs/`](./docs/) folder.

## Project Structure

```
api_first_angular_springboot/
├── api/                          # OpenAPI specifications
│   └── task-api.yaml            # Task Manager API contract
├── backend/                      # Spring Boot backend
│   ├── mvnw / mvnw.cmd          # Maven wrapper scripts
│   ├── .mvn/wrapper/            # Maven wrapper files
│   ├── src/main/java/com/example/taskmanager/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access
│   │   └── entity/              # JPA entities
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml                  # Maven configuration
├── frontend/                     # Angular frontend
│   ├── src/app/
│   │   ├── components/          # UI components
│   │   ├── services/            # Custom services
│   │   └── generated/           # Generated API client
│   ├── angular.json
│   └── package.json
├── docs/                         # Documentation
│   ├── api-first-angular-springboot.md  # Main article
│   ├── QUICK-START.md           # 5-minute quick start
│   ├── SETUP-GUIDE.md           # Complete setup guide
│   ├── CI-CD-GUIDE.md           # CI/CD pipeline details
│   └── PROJECT-OVERVIEW.md      # High-level overview
├── .github/workflows/
│   └── ci-cd.yml                # CI/CD pipeline
├── .gitattributes               # Git file handling rules
├── .gitignore                   # Git ignore rules
├── openapitools.json            # OpenAPI generator config
└── README.md                    # This file
```

## Features

- **API-First Design**: OpenAPI 3.0 specification defines the contract
- **Spring Boot 3.2**: Modern backend with JPA, H2 database, SpringDoc
- **Angular 20+**: Standalone components, signals, rxResource, modern control flow
- **Code Generation**: Automated client/server code generation from OpenAPI spec
- **Safe Regeneration**: Backend uses service layer, frontend separates generated code

## Prerequisites

- **Java 17+** (for Spring Boot)
- **Node.js 20+** and npm (for Angular)
- **Maven** (optional - we use Maven Wrapper `mvnw`)
- **Angular CLI 20+** (optional, for Angular development)

> **Note**: Maven installation is optional because this project uses **Maven Wrapper** (`mvnw`/`mvnw.cmd`). The wrapper automatically downloads the correct Maven version on first use. See [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) for details.

## Quick Start

### 1. Generate API Code

Generate both backend models and frontend client:

```bash
# Install OpenAPI Generator CLI (if not installed)
npm install -g @openapitools/openapi-generator-cli

# Generate Spring Boot models (using Maven Wrapper)
cd backend
./mvnw generate-sources        # Unix/Linux/macOS
# OR
mvnw.cmd generate-sources      # Windows

# Generate Angular client
cd ../frontend
npm install
npm run generate-api
```

### 2. Start the Backend

```bash
cd backend

# Run with Maven Wrapper (recommended)
./mvnw spring-boot:run         # Unix/Linux/macOS
# OR
mvnw.cmd spring-boot:run       # Windows

# Or build and run JAR
./mvnw clean package
java -jar target/task-manager-1.0.0-SNAPSHOT.jar
```

The backend will start at `http://localhost:8080`

**Available endpoints:**
- API: `http://localhost:8080/api/v1/tasks`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

The frontend will start at `http://localhost:4200`

## API Endpoints

All endpoints are prefixed with `/api/v1`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (supports `?completed=true/false&limit=20`) |
| GET | `/tasks/{id}` | Get task by ID |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/{id}` | Update existing task |
| DELETE | `/tasks/{id}` | Delete task |

## Development Workflow

### Modifying the API

1. Edit `api/task-api.yaml`
2. Regenerate backend models: `cd backend && mvn generate-sources`
3. Regenerate frontend client: `cd frontend && npm run generate-api`
4. Update custom business logic in backend services
5. Update frontend components to use new features

### Backend Development

The backend follows a layered architecture:

- **Generated Models** (in `target/generated-sources`): Auto-generated DTOs
- **Controller**: Implements REST endpoints, maps between DTOs and entities
- **Service**: Business logic layer
- **Repository**: Data access layer
- **Entity**: JPA database entities

**Key files:**
- `TaskController.java` - REST API implementation
- `TaskService.java` - Business logic
- `TaskEntity.java` - Database entity

### Frontend Development

The frontend separates generated and custom code:

- **Generated** (`src/app/generated`): API client code
- **Services** (`src/app/services`): Custom stores and business logic
- **Components** (`src/app/components`): UI components

**Key files:**
- `task-resource-store.ts` - rxResource-based state management
- `task-list.component.ts` - Main UI component

## Key Concepts Demonstrated

### 1. API-First Approach

The OpenAPI specification (`api/task-api.yaml`) is the single source of truth. Both backend and frontend are generated from this contract.

### 2. Safe Code Regeneration

**Backend Strategy**: Custom business logic is in services and controllers, not in generated code.

**Frontend Strategy**: Generated code is isolated in `generated/` folder, custom logic in separate services.

### 3. Modern Angular Features

- **Standalone Components**: No module boilerplate
- **Signals**: Reactive state management
- **rxResource**: Declarative API calls with loading states
- **Modern Control Flow**: `@if`, `@for`, `@else` syntax

### 4. Spring Boot Best Practices

- Interface-based controllers
- Service layer for business logic
- JPA for data access
- SpringDoc for API documentation

## Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## CI/CD Pipeline

This project includes a comprehensive GitHub Actions workflow that:

1. **Generates API Code**: Automatically regenerates backend and frontend code from OpenAPI spec
2. **Commits Generated Code**: Pushes generated code back to repository (with `[skip ci]` tag)
3. **Builds & Tests**: Parallel builds for backend and frontend with full test coverage
4. **Integration Tests**: Tests backend API endpoints
5. **Security Scanning**: Trivy + dependency checks
6. **Deploys**: Automatic deployment to staging on `main` branch pushes

### Pipeline Status

[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml)

### Triggering the Pipeline

**Automatic**: Pushes to `main` or `develop` branches, or pull requests

**Manual**:
```bash
gh workflow run ci-cd.yml
```

### Viewing Pipeline Results

```bash
# List recent runs
gh run list

# Watch current run
gh run watch
```

For detailed CI/CD documentation, see [docs/CI-CD-GUIDE.md](./docs/CI-CD-GUIDE.md)

## Building for Production

### Backend

```bash
cd backend
./mvnw clean package
# Output: target/task-manager-1.0.0-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
# Output: dist/task-manager/
```

## Troubleshooting

### Backend won't start

- Check Java version: `java -version` (should be 17+)
- Check port 8080 is available: `netstat -ano | findstr :8080`
- Check logs in console for errors

### Frontend won't compile

- Delete `node_modules` and `package-lock.json`, then `npm install`
- Make sure Angular CLI is updated: `npm install -g @angular/cli@latest`
- Check if generated code exists: `ls src/app/generated`

### Generated code is missing

Run the generation commands:
```bash
# Backend
cd backend && mvn generate-sources

# Frontend
cd frontend && npm run generate-api
```

### CORS errors

Check that `backend/src/main/resources/application.properties` has:
```properties
spring.web.cors.allowed-origins=http://localhost:4200
```

## Documentation

Complete documentation is organized in the [`docs/`](./docs/) folder:

| Document | Purpose | Reading Time |
|----------|---------|--------------|
| [QUICK-START.md](./docs/QUICK-START.md) | Get running in 5 minutes | 5 min |
| [SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) | Maven wrapper, Git config, setup | 15 min |
| [CI-CD-GUIDE.md](./docs/CI-CD-GUIDE.md) | Complete CI/CD pipeline guide | 25 min |
| [PROJECT-OVERVIEW.md](./docs/PROJECT-OVERVIEW.md) | Architecture & high-level overview | 10 min |
| [api-first-angular-springboot.md](./docs/api-first-angular-springboot.md) | API-first concepts & patterns | 20 min |

## Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Angular Documentation](https://angular.dev)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [SpringDoc OpenAPI](https://springdoc.org/)

## License

MIT License - feel free to use this as a template for your projects!
