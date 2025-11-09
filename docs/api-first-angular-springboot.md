# API-First Development: Building Modern Applications with Angular 20+ and Spring Boot

In modern software development, the **API-first approach** is increasingly essential. By designing APIs before building frontend or backend logic, teams can work in parallel, reduce integration issues, and create more maintainable applications.

This article demonstrates API-first development using **Angular 20+** (with `httpResource`, signals, and modern control flow templates) for the frontend and **Spring Boot** for the backend.

---

## What is API-First Development?

API-first development treats APIs as **first-class citizens**. Instead of building backend services and then exposing endpoints, API contracts are defined upfront, often using **OpenAPI (Swagger)**. Benefits include:

- **Consistency**: APIs follow a standard structure.
- **Collaboration**: Frontend and backend can work simultaneously.
- **Clear Documentation**: Contracts reduce miscommunication and improve maintainability.

---

## Why Angular 20+ and Spring Boot?

- **Angular 20+**: Supports **signals** for reactive state management, `httpResource` for API consumption, and modern control flow syntax (`@if`, `@for`, `@switch`). Standalone components reduce boilerplate.
- **Spring Boot**: Simplifies REST API development, integrates with OpenAPI, and supports modern microservices.

---

## Step 1: Designing the API

Define the API contract first. Example using **OpenAPI** for a “Task Manager”:

```yaml
openapi: 3.0.0
info:
  title: Task Manager API
  version: 1.0.0
paths:
  /tasks:
    get:
      summary: Get all tasks
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
    post:
      summary: Create a new task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Task'
      responses:
        '201':
          description: Task created
components:
  schemas:
    Task:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        completed:
          type: boolean
```

This contract allows both backend and frontend teams to work independently.

---

## Step 2: Implementing the Backend with Spring Boot

Using Spring Boot, endpoints can be implemented easily following the API contract. To avoid overwriting custom logic when regenerating code, use **Option B: extend generated controllers**:

```java
// Generated: TaskControllerGenerated.java
@RestController
@RequestMapping("/tasks")
public class TaskControllerGenerated { ... }

// Custom logic: TaskController.java
@RestController
@RequestMapping("/tasks")
public class TaskController extends TaskControllerGenerated {
    // override methods or add business logic
}
```

This allows you to **regenerate code safely** while keeping your custom implementations intact.

---

## Step 3: Building the Frontend with Angular 20+ Using `httpResource`

Angular 20+ provides **signals** and `httpResource` for reactive API consumption. To avoid overwriting custom code, use **Option A: separate generated code from custom code**.

- Keep **generated code in a dedicated folder** (`/generated`) and write custom logic in separate services or components:

```
src/
 ├─ app/
 │   ├─ generated/      <-- openapi-generator-cli output
 │   └─ services/       <-- your custom services or wrappers
```

### How to Use Code From the Generated Part

#### Option 1: Using `httpResource` (Recommended for Angular 20+)

1. **Create a Resource-Based Store**

```typescript
import { Injectable, resource } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Task } from '../generated';
import { TaskService } from '../generated';

@Injectable({ providedIn: 'root' })
export class TaskResourceStore {
  constructor(private taskService: TaskService) {}

  // Using rxResource for Observable-based APIs
  tasksResource = rxResource({
    loader: () => this.taskService.getTasks()
  });

  // Access data, loading state, and errors
  tasks = this.tasksResource.value;
  isLoading = this.tasksResource.isLoading;
  error = this.tasksResource.error;

  // Reload tasks
  reload() {
    this.tasksResource.reload();
  }
}
```

2. **Use in Component with Modern Control Flow**

```typescript
import { Component } from '@angular/core';
import { TaskResourceStore } from '../services/task-resource-store';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [],
  template: `
    @if (store.isLoading()) {
      <div>Loading tasks...</div>
    } @else if (store.error()) {
      <div class="error">Error: {{ store.error()?.message }}</div>
    } @else if (store.tasks()) {
      <ul>
        @for (task of store.tasks(); track task.id) {
          <li>{{ task.title }} - {{ task.completed ? '✓ Done' : 'Pending' }}</li>
        }
      </ul>
      <button (click)="store.reload()">Refresh</button>
    }
  `
})
export class TaskListComponent {
  constructor(public store: TaskResourceStore) {}
}
```

#### Option 2: Traditional Observable Approach

For teams transitioning from older Angular versions or working with generated services:

```typescript
import { Injectable, signal } from '@angular/core';
import { TaskService } from '../generated';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  tasks = signal<Task[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private taskService: TaskService) {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading.set(true);
    this.error.set(null);

    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
}
```

> **Best Practice**: Use `rxResource` for seamless integration with generated OpenAPI services. It provides automatic loading states, error handling, and integrates perfectly with Angular's signal-based reactivity.

---

## Step 4: Using Generators to Automate Development

### Generator Configuration

Create configuration files for consistent code generation:

**openapitools.json** (Project root)
```json
{
  "generator-cli": {
    "version": "7.0.1",
    "generators": {
      "spring": {
        "generatorName": "spring",
        "output": "./backend",
        "inputSpec": "./api/task-api.yaml",
        "additionalProperties": {
          "interfaceOnly": "true",
          "useSpringBoot3": "true",
          "documentationProvider": "springdoc"
        }
      },
      "angular": {
        "generatorName": "typescript-angular",
        "output": "./frontend/src/app/generated",
        "inputSpec": "./api/task-api.yaml",
        "additionalProperties": {
          "ngVersion": "20.0.0",
          "supportsES6": "true"
        }
      }
    }
  }
}
```

### Regeneration Strategy

- **Backend**: extend generated controllers to preserve custom logic.
- **Frontend**: separate generated code from custom services/components.

Regenerate when the OpenAPI spec is updated:

```bash
# Backend regeneration
npx @openapitools/openapi-generator-cli generate -g spring

# Frontend regeneration
npx @openapitools/openapi-generator-cli generate -g angular
```

### Version Control Considerations

**.gitignore recommendations:**
```
# Option 1: Commit generated code (recommended for small teams)
# No additional gitignore entries

# Option 2: Regenerate on build (for larger teams)
backend/generated/
frontend/src/app/generated/
```

**Pros of committing generated code:**
- Easier onboarding (no generation step required)
- Clear diff when API changes
- Faster local builds

**Pros of regenerating:**
- Smaller repository size
- Forces API spec to be source of truth
- No merge conflicts in generated code

---

## Benefits of API-First Approach with Angular 20+ and Spring Boot

1. **Parallel Development**: Frontend and backend teams can work independently.  
2. **Strong API Contracts**: Reduces miscommunication and ensures consistency.  
3. **Scalability**: APIs designed upfront are easier to extend or version.  
4. **Reactive Frontend**: Signals and `httpResource` simplify reactive UI updates and request management.  
5. **Safe Regeneration**: Using inheritance on the backend and separate folders on the frontend prevents accidental deletion of custom code.

---

## Conclusion

Combining **API-first development**, **Spring Boot with extended controllers**, and **Angular 20+ with separated generated code and modern control flow syntax** allows teams to build maintainable and reactive applications efficiently, while safely regenerating code as APIs evolve.

---

**References:**
- [Angular Control Flow Guide](https://angular.dev/guide/templates/control-flow)
- [Angular httpResource Guide](https://angular.dev/guide/http/http-resource)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Springdoc OpenAPI](https://springdoc.org/)

