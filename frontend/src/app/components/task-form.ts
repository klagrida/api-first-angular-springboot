import { Component, EventEmitter, Input, Output, signal, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskModelGen, TaskCreateModelGen, TaskUpdateModelGen } from '../generated';

/**
 * Task Form Component
 *
 * Handles both create and edit modes for tasks using signal-based forms
 */
@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="task-form-overlay" (click)="onCancel()">
      <div class="task-form" (click)="$event.stopPropagation()">
        <h3>{{ editTask() ? 'Edit Task' : 'New Task' }}</h3>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              placeholder="Enter task title"
              [class.invalid]="taskForm.controls.title.touched && taskForm.controls.title.invalid"
            />
            @if (taskForm.controls.title.touched && taskForm.controls.title.invalid) {
              <span class="error-message">Title is required</span>
            }
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" formControlName="priority">
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
                formControlName="dueDate"
              />
            </div>
          </div>

          @if (editTask()) {
            <div class="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  formControlName="completed"
                />
                <span>Completed</span>
              </label>
            </div>
          }

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onCancel()">
              Cancel
            </button>
            <button type="submit" class="btn-primary" [disabled]="taskForm.invalid">
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

    .form-group input.invalid,
    .form-group select.invalid,
    .form-group textarea.invalid {
      border-color: #f44336;
    }

    .error-message {
      display: block;
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #4CAF50;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
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
export class TaskForm {
  @Input() editTask = signal<TaskModelGen | null>(null);
  @Output() save = new EventEmitter<TaskCreateModelGen | TaskUpdateModelGen>();
  @Output() cancel = new EventEmitter<void>();

  // Signal-based reactive form
  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl(''),
    priority: new FormControl<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM'),
    dueDate: new FormControl(''),
    completed: new FormControl(false)
  });

  constructor() {
    // Update form when editTask changes
    effect(() => {
      const task = this.editTask();
      if (task) {
        this.taskForm.patchValue({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'MEDIUM',
          dueDate: this.formatDateForInput(task.dueDate),
          completed: task.completed || false
        });
      } else {
        this.resetForm();
      }
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    const isEdit = !!this.editTask();

    // Convert date string (YYYY-MM-DD) to ISO datetime (YYYY-MM-DDTHH:mm:ssZ)
    let dueDateTime: string | undefined = undefined;
    if (formValue.dueDate) {
      const dateValue = formValue.dueDate;
      if (dateValue.length === 10) {
        // YYYY-MM-DD format - append time
        dueDateTime = `${dateValue}T00:00:00Z`;
      } else {
        // Already in datetime format
        dueDateTime = dateValue;
      }
    }

    const taskData: any = {
      title: formValue.title?.trim(),
      description: formValue.description?.trim() || undefined,
      priority: formValue.priority || undefined,
      dueDate: dueDateTime
    };

    // Only include completed for edit mode
    if (isEdit) {
      taskData.completed = formValue.completed;
    }

    this.save.emit(taskData);
  }

  onCancel() {
    this.cancel.emit();
  }

  private resetForm() {
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      completed: false
    });
  }

  private formatDateForInput(dateString?: string): string {
    if (!dateString) return '';

    try {
      // Handle ISO datetime strings - extract just the date part
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      // Format as YYYY-MM-DD for HTML date input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  }
}
