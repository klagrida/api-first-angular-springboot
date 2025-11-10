# API-First Development with Angular 20+ and Spring Boot

## What is API-First Development?

API-first development treats APIs as **first-class citizens**. Instead of building backend services and then exposing endpoints, API contracts are defined upfront using **OpenAPI (Swagger)**.

### Key Benefits

- **Design First**: API contract is defined before implementation
- **Single Source of Truth**: OpenAPI spec drives both backend and frontend
- **Parallel Development**: Frontend and backend teams work independently
- **Type Safety**: Generated code ensures compile-time contract compliance
- **Clear Documentation**: Contracts reduce miscommunication
- **Easy Evolution**: Changes to API are reflected in generated code

---

## Project Architecture

### 1. API Contract (`api/task-api.yaml`)

The OpenAPI specification defines the complete API contract:

```yaml
openapi: 3.0.0
info:
  title: Task Manager API
  version: 1.0.0
paths:
  /tasks:
    get:
      summary: Get all tasks
      parameters:
        - name: completed
          in: query
          schema:
            type: boolean
      responses:
        '200':
          description: List of tasks
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
```

### 2. Backend Implementation (Spring Boot)

#### Generated Code (`backend/src/main/java/.../generated/`)

**Automatically generated** from the OpenAPI spec:

```java
// TasksApi.java - Generated Interface
@Validated
@Tag(name = "tasks")
public interface TasksApi {

    @RequestMapping(
        method = RequestMethod.GET,
        value = "/tasks",
        produces = { "application/json" }
    )
    ResponseEntity<List<Task>> getTasks(
        @RequestParam(required = false) Boolean completed,
        @RequestParam(required = false, defaultValue = "20") Integer limit
    );
}
```

**What's in the generated code:**
- `@RequestMapping` with paths, methods, content types
- `@RequestParam` / `@PathVariable` with validation
- `@Valid` annotations for request body validation
- OpenAPI/Swagger documentation annotations
- Type-safe model classes (Task, TaskCreate, TaskUpdate)

#### Your Implementation

**Controller implements the generated interface:**

```java
@RestController
@RequestMapping("/api/v1")
public class TaskController implements TasksApi {

    private final TaskService taskService;

    @Override  // ← Ensures compliance with generated interface
    public ResponseEntity<List<Task>> getTasks(Boolean completed, Integer limit) {
        // YOUR business logic here
        List<TaskEntity> entities = taskService.getAllTasks(completed, limit);
        return ResponseEntity.ok(
            entities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList())
        );
    }

    // Your helper methods, mapping logic, etc.
}
```

**Benefits of this approach:**
- ✅ **Compile-time safety**: If API spec changes, code won't compile until fixed
- ✅ **No duplicate annotations**: All Spring annotations come from interface
- ✅ **Clean controller**: Only business logic, no infrastructure code
- ✅ **Auto documentation**: Swagger annotations inherited from interface

### 3. Frontend Implementation (Angular 20+)

#### Generated Code (`frontend/src/app/generated/`)

**Automatically generated** TypeScript client:

```typescript
// services/task.service.ts - Generated
@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks(completed?: boolean, limit?: number): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(
      `${this.basePath}/tasks`,
      { params: { completed, limit } }
    );
  }
}

// models/task.ts - Generated
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}
```

#### Your Implementation

**Use rxResource for reactive state management:**

```typescript
// task-resource-store.ts - Your code
@Injectable({ providedIn: 'root' })
export class TaskResourceStore {
  constructor(private taskService: TaskService) {}

  tasksResource = rxResource({
    loader: () => this.taskService.getTasks()
  });

  // Reactive signals for UI
  tasks = this.tasksResource.value;
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;
}
```

**Component with modern control flow:**

```typescript
@Component({
  selector: 'app-task-list',
  standalone: true,
  template: `
    @if (store.isLoading()) {
      <div>Loading...</div>
    } @else if (store.error()) {
      <div class="error">{{ store.error()?.message }}</div>
    } @else {
      @for (task of store.tasks(); track task.id) {
        <li>{{ task.title }}</li>
      }
    }
  `
})
export class TaskListComponent {
  constructor(public store: TaskResourceStore) {}
}
```

---

## Code Generation Workflow

### Directory Structure

```
project/
├── api/
│   └── task-api.yaml                    ← Source of truth
├── backend/
│   └── src/main/java/.../
│       ├── generated/                   ← Generated (committed)
│       │   ├── api/TasksApi.java       ← Generated interface
│       │   └── model/Task.java         ← Generated models
│       ├── controller/
│       │   └── TaskController.java      ← Your code (implements TasksApi)
│       ├── service/
│       │   └── TaskService.java         ← Your code
│       └── entity/
│           └── TaskEntity.java          ← Your code
└── frontend/
    └── src/app/
        ├── generated/                   ← Generated (committed)
        │   ├── services/               ← Generated services
        │   └── models/                 ← Generated models
        ├── services/
        │   └── task-resource-store.ts   ← Your code
        └── components/
            └── task-list.component.ts   ← Your code
```

### Generation Commands

**Backend:**
```bash
cd backend
./mvnw generate-sources
```

**Frontend:**
```bash
cd frontend
npm run generate-api
```

### CI/CD Automation

The CI pipeline automatically:
1. Validates OpenAPI spec
2. Generates backend and frontend code
3. Detects changes in generated code
4. Commits and pushes back to repository
5. Builds and tests everything

---

## Key Patterns

### 1. Backend: Implement Generated Interface

**Why?**
- Compile-time verification of API contract
- Automatic Swagger/OpenAPI documentation
- No duplicate Spring annotations
- Type-safe method signatures

**How?**
```java
public class TaskController implements TasksApi {
    @Override
    public ResponseEntity<Task> createTask(TaskCreate request) {
        // Implementation
    }
}
```

### 2. Frontend: Wrap Generated Services

**Why?**
- Add reactive state management
- Handle loading/error states
- Cache and optimize requests
- Business logic separate from API calls

**How?**
```typescript
export class TaskResourceStore {
  constructor(private taskService: TaskService) {}  // ← Inject generated service

  tasksResource = rxResource({
    loader: () => this.taskService.getTasks()  // ← Use generated service
  });
}
```

### 3. Configuration Management

**Backend CORS:**
```properties
# application.properties
cors.allowed-origins=http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
```

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
                .allowedOrigins(allowedOrigins.split(","));
    }
}
```

**Frontend Environment:**
```typescript
// environment.ts
export const environment = {
  apiUrl: 'http://localhost:8080/api/v1'
};
```

---

## Development Workflow

### Making API Changes

1. **Update OpenAPI spec** (`api/task-api.yaml`)
   ```yaml
   # Add new field
   Task:
     properties:
       status:
         type: string
         enum: [TODO, IN_PROGRESS, DONE]
   ```

2. **Regenerate code**
   ```bash
   # Backend
   cd backend && ./mvnw generate-sources

   # Frontend
   cd frontend && npm run generate-api
   ```

3. **Fix compilation errors**
   - Backend: Update controller implementation
   - Frontend: Update components using the models

4. **Test and commit**
   ```bash
   git add .
   git commit -m "feat: add task status field"
   git push
   ```

5. **CI automatically regenerates and commits** if needed

---

## Best Practices

### ✅ DO

- **Define API contract first** before implementing
- **Commit generated code** to repository (easier onboarding)
- **Use meaningful names** in OpenAPI spec
- **Add examples** to OpenAPI spec for documentation
- **Version your APIs** (e.g., `/api/v1/`)
- **Use proper HTTP methods** (GET, POST, PUT, DELETE)
- **Include validation** in OpenAPI spec

### ❌ DON'T

- **Don't edit generated code** - it will be overwritten
- **Don't add business logic** to generated classes
- **Don't hardcode URLs** - use configuration
- **Don't skip validation** in OpenAPI spec
- **Don't mix generated and custom code** in same file

---

## Advantages Over Traditional Development

| Traditional | API-First |
|-------------|-----------|
| Backend built first → Frontend adapts | Contract defined first → Both implement |
| API documentation as afterthought | Documentation from spec |
| Manual API client code | Generated type-safe client |
| Runtime errors for mismatches | Compile-time errors |
| Tight coupling | Loose coupling via contract |
| Sequential development | Parallel development |

---

## Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Angular Modern Control Flow](https://angular.dev/guide/templates/control-flow)
- [Angular rxResource](https://angular.dev/guide/http/http-resource)
- [Spring Boot with OpenAPI](https://springdoc.org/)
- [API-First Best Practices](https://swagger.io/resources/articles/adopting-an-api-first-approach/)

---

## Conclusion

API-first development with generated code provides:

- **Type safety** across frontend and backend
- **Faster development** through parallel work
- **Better maintainability** with single source of truth
- **Automatic documentation** from OpenAPI spec
- **Reduced bugs** through compile-time checking

This approach scales well for teams of any size and ensures long-term maintainability of APIs.
