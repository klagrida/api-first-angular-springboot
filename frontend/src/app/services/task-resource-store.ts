import { Injectable, signal, effect } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { TaskGen, TasksServiceGen, TaskCreateGen, TaskUpdateGen } from '../generated';

/**
 * Task Resource Store using Angular 20+ signals
 *
 * This service wraps the generated API client with reactive state management.
 * It demonstrates the modern API-first approach with Angular signals.
 */
@Injectable({ providedIn: 'root' })
export class TaskResourceStore {
  constructor(private taskService: TasksServiceGen) {
    // Auto-load tasks when filter changes
    effect(() => {
      const filter = this.filterSignal();
      this.loadTasks(filter.completed, filter.limit);
    });
  }

  // State signals
  tasks = signal<TaskGen[]>([]);
  isLoading = signal(false);
  error = signal<any>(null);

  // Filter state
  private filterSignal = signal<{ completed?: boolean; limit?: number }>({});

  /**
   * Load tasks from API
   */
  private async loadTasks(completed?: boolean, limit?: number) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const tasks = await lastValueFrom(this.taskService.getTasks(completed, limit));
      this.tasks.set(tasks);
    } catch (err) {
      this.error.set(err);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Update filter and automatically reload tasks
   */
  setFilter(completed?: boolean, limit?: number) {
    this.filterSignal.set({ completed, limit });
  }

  /**
   * Manually reload tasks
   */
  reload() {
    const filter = this.filterSignal();
    this.loadTasks(filter.completed, filter.limit);
  }

  /**
   * Create a new task
   */
  async createTask(taskCreate: TaskCreateGen): Promise<TaskGen> {
    const task = await lastValueFrom(this.taskService.createTask(taskCreate));
    this.reload(); // Refresh the list
    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(id: number, taskUpdate: TaskUpdateGen): Promise<TaskGen> {
    const task = await lastValueFrom(this.taskService.updateTask(id, taskUpdate));
    this.reload(); // Refresh the list
    return task;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    await lastValueFrom(this.taskService.deleteTask(id));
    this.reload(); // Refresh the list
  }
}
