import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskResourceStore } from '../services/task-resource-store';
import { Task, TaskCreate, TaskUpdate } from '../generated';
import { TaskFormComponent } from './task-form.component';

/**
 * Task List Component using Angular 20+ features
 *
 * Demonstrates:
 * - Standalone components
 * - Modern control flow (@if, @for)
 * - Signal-based reactivity
 * - rxResource for API calls
 * - CRUD operations
 */
@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h2>Task Manager</h2>
        <button class="btn-create" (click)="openCreateForm()">
          <span class="icon">+</span> New Task
        </button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <button
          [class.active]="currentFilter() === undefined"
          (click)="store.setFilter(undefined)">
          All
        </button>
        <button
          [class.active]="currentFilter() === false"
          (click)="setActiveFilter()">
          Active
        </button>
        <button
          [class.active]="currentFilter() === true"
          (click)="setCompletedFilter()">
          Completed
        </button>
        <button (click)="store.reload()">
          <span class="icon">↻</span> Refresh
        </button>
      </div>

      <!-- Loading State -->
      @if (store.isLoading()) {
        <div class="loading">Loading tasks...</div>
      }

      <!-- Error State -->
      @else if (store.error()) {
        <div class="error">
          Error: {{ store.error()?.message }}
        </div>
      }

      <!-- Task List -->
      @else if (store.tasks()) {
        <div class="tasks">
          @if (store.tasks().length === 0) {
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
                    <button class="btn-complete" (click)="toggleTask(task)">
                      {{ task.completed ? '↶ Undo' : '✓ Complete' }}
                    </button>
                    <button class="btn-edit" (click)="openEditForm(task)">
                      ✎ Edit
                    </button>
                    <button class="btn-delete" (click)="deleteTask(task.id!)">
                      🗑 Delete
                    </button>
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      }

      <!-- Task Form Modal -->
      @if (showForm()) {
        <app-task-form
          [editTask]="editingTask"
          (save)="onSaveTask($event)"
          (cancel)="closeForm()"
        />
      }
    </div>
  `,
  styles: [`
    .task-list-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .header h2 {
      margin: 0;
    }

    .btn-create {
      padding: 0.75rem 1.5rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }

    .btn-create:hover {
      background: #45a049;
    }

    .btn-create .icon {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .filters {
      margin: 1rem 0;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filters button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .filters button:hover {
      background: #f0f0f0;
    }

    .filters button.active {
      background: #2196F3;
      color: white;
      border-color: #2196F3;
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
      flex-wrap: wrap;
    }

    .task-actions button {
      padding: 0.5rem 1rem;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .btn-complete {
      background: #4CAF50;
      color: white;
    }

    .btn-complete:hover {
      background: #45a049;
    }

    .btn-edit {
      background: #2196F3;
      color: white;
    }

    .btn-edit:hover {
      background: #0b7dda;
    }

    .btn-delete {
      background: #f44336;
      color: white;
    }

    .btn-delete:hover {
      background: #da190b;
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
  showForm = signal(false);
  editingTask = signal<Task | null>(null);
  currentFilter = signal<boolean | undefined>(undefined);

  constructor(public store: TaskResourceStore) {}

  openCreateForm() {
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  openEditForm(task: Task) {
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  async onSaveTask(taskData: TaskCreate | TaskUpdate) {
    const editTask = this.editingTask();

    if (editTask) {
      // Update existing task
      await this.store.updateTask(editTask.id!, taskData as TaskUpdate);
    } else {
      // Create new task
      await this.store.createTask(taskData as TaskCreate);
    }

    this.closeForm();
  }

  toggleTask(task: Task) {
    this.store.updateTask(task.id!, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
      priority: task.priority,
      dueDate: task.dueDate
    });
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.deleteTask(id);
    }
  }

  setActiveFilter() {
    this.currentFilter.set(false);
    this.store.setFilter(false);
  }

  setCompletedFilter() {
    this.currentFilter.set(true);
    this.store.setFilter(true);
  }
}
