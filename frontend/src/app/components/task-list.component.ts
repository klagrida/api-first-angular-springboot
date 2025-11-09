import { Component } from '@angular/core';
import { TaskResourceStore } from '../services/task-resource-store';

/**
 * Task List Component using Angular 20+ features
 *
 * Demonstrates:
 * - Standalone components
 * - Modern control flow (@if, @for)
 * - Signal-based reactivity
 * - rxResource for API calls
 *
 * After generating the API client, uncomment the template code
 */
@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [],
  template: `
    <div class="task-list-container">
      <h2>Task Manager</h2>

      <!-- Filters -->
      <div class="filters">
        <button (click)="store.setFilter(undefined)">All</button>
        <button (click)="store.setFilter(false)">Active</button>
        <button (click)="store.setFilter(true)">Completed</button>
        <button (click)="store.reload()">Refresh</button>
      </div>

      <!-- Loading State -->
      <!-- @if (store.isLoading()) {
        <div class="loading">Loading tasks...</div>
      } -->

      <!-- Error State -->
      <!-- @else if (store.error()) {
        <div class="error">
          Error: {{ store.error()?.message }}
        </div>
      } -->

      <!-- Task List -->
      <!-- @else if (store.tasks()) {
        <div class="tasks">
          @if (store.tasks()?.length === 0) {
            <p>No tasks found. Create your first task!</p>
          } @else {
            <ul>
              @for (task of store.tasks(); track task.id) {
                <li [class.completed]="task.completed">
                  <div class="task-content">
                    <h3>{{ task.title }}</h3>
                    @if (task.description) {
                      <p>{{ task.description }}</p>
                    }
                    <div class="task-meta">
                      <span class="priority" [class]="'priority-' + task.priority?.toLowerCase()">
                        {{ task.priority }}
                      </span>
                      @if (task.dueDate) {
                        <span class="due-date">Due: {{ task.dueDate | date }}</span>
                      }
                    </div>
                  </div>
                  <div class="task-actions">
                    <button (click)="toggleTask(task)">
                      {{ task.completed ? 'Undo' : 'Complete' }}
                    </button>
                    <button (click)="deleteTask(task.id)">Delete</button>
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      } -->

      <!-- Placeholder while API is not generated -->
      <div class="placeholder">
        <p>Run <code>npm run generate-api</code> to generate the API client.</p>
        <p>Then uncomment the template code in this component.</p>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .filters {
      margin: 1rem 0;
      display: flex;
      gap: 0.5rem;
    }

    .filters button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }

    .filters button:hover {
      background: #f0f0f0;
    }

    .loading, .error {
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .loading {
      background: #e3f2fd;
      color: #1976d2;
    }

    .error {
      background: #ffebee;
      color: #c62828;
    }

    .tasks ul {
      list-style: none;
      padding: 0;
    }

    .tasks li {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tasks li.completed {
      opacity: 0.6;
      text-decoration: line-through;
    }

    .task-content h3 {
      margin: 0 0 0.5rem 0;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .priority {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: bold;
    }

    .priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .priority-medium {
      background: #fff3e0;
      color: #ef6c00;
    }

    .priority-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .task-actions {
      display: flex;
      gap: 0.5rem;
    }

    .task-actions button {
      padding: 0.5rem 1rem;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    .placeholder {
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
      text-align: center;
    }

    .placeholder code {
      background: #e0e0e0;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class TaskListComponent {
  constructor(public store: TaskResourceStore) {}

  // Uncomment after generating API client
  // toggleTask(task: Task) {
  //   this.store.updateTask(task.id, {
  //     ...task,
  //     completed: !task.completed
  //   });
  // }

  // deleteTask(id: number) {
  //   if (confirm('Are you sure you want to delete this task?')) {
  //     this.store.deleteTask(id);
  //   }
  // }
}
