import { Component, EventEmitter, Input, Output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskCreate, TaskUpdate } from '../generated';

/**
 * Task Form Component
 *
 * Handles both create and edit modes for tasks
 */
@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task-form-overlay" (click)="onCancel()">
      <div class="task-form" (click)="$event.stopPropagation()">
        <h3>{{ editTask() ? 'Edit Task' : 'New Task' }}</h3>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              type="text"
              [(ngModel)]="formData.title"
              name="title"
              required
              placeholder="Enter task title"
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              [(ngModel)]="formData.description"
              name="description"
              rows="3"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" [(ngModel)]="formData.priority" name="priority">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                [(ngModel)]="formData.dueDate"
                name="dueDate"
              />
            </div>
          </div>

          @if (editTask()) {
            <div class="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="formData.completed"
                  name="completed"
                />
                <span>Completed</span>
              </label>
            </div>
          }

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ editTask() ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .task-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .task-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .task-form h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
      margin-right: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background: #4CAF50;
      color: white;
    }

    .btn-primary:hover {
      background: #45a049;
    }

    .btn-secondary {
      background: #f1f1f1;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }
  `]
})
export class TaskFormComponent {
  @Input() editTask = signal<Task | null>(null);
  @Output() save = new EventEmitter<TaskCreate | TaskUpdate>();
  @Output() cancel = new EventEmitter<void>();

  formData: any = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    completed: false
  };

  constructor() {
    // Update form when editTask changes
    effect(() => {
      const task = this.editTask();
      if (task) {
        this.formData = {
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'MEDIUM',
          dueDate: task.dueDate || '',
          completed: task.completed || false
        };
      } else {
        this.resetForm();
      }
    });
  }

  onSubmit() {
    if (!this.formData.title?.trim()) {
      return;
    }

    const isEdit = !!this.editTask();

    const taskData: any = {
      title: this.formData.title.trim(),
      description: this.formData.description?.trim() || undefined,
      priority: this.formData.priority || undefined,
      dueDate: this.formData.dueDate || undefined
    };

    // Only include completed for edit mode
    if (isEdit) {
      taskData.completed = this.formData.completed;
    }

    this.save.emit(taskData);
    // Don't reset form here - let parent handle closing/resetting
  }

  onCancel() {
    this.cancel.emit();
    // Don't reset form here - let parent handle closing/resetting
  }

  private resetForm() {
    this.formData = {
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      completed: false
    };
  }
}
