import { Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
// Note: Import from generated code after running npm run generate-api
// import { Task, TaskService, TaskCreate, TaskUpdate } from '../generated';

/**
 * Task Resource Store using Angular 20+ rxResource
 *
 * This service wraps the generated API client with reactive state management.
 * It demonstrates the modern API-first approach with Angular signals.
 *
 * Usage:
 * 1. Generate API client: npm run generate-api
 * 2. Uncomment the imports above
 * 3. Inject this service into components
 */
@Injectable({ providedIn: 'root' })
export class TaskResourceStore {
  // Uncomment after generating API client
  // constructor(private taskService: TaskService) {}

  // Filter state
  private filterSignal = signal<{ completed?: boolean; limit?: number }>({});

  // Tasks resource with automatic loading/error states
  // tasksResource = rxResource({
  //   request: () => this.filterSignal(),
  //   loader: ({ request }) =>
  //     this.taskService.getTasks(request.completed, request.limit)
  // });

  // Computed signals for easy access
  // tasks = this.tasksResource.value;
  // isLoading = this.tasksResource.isLoading;
  // error = this.tasksResource.error;

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
    // this.tasksResource.reload();
  }

  /**
   * Create a new task
   */
  // async createTask(taskCreate: TaskCreate): Promise<Task> {
  //   const task = await lastValueFrom(this.taskService.createTask(taskCreate));
  //   this.reload(); // Refresh the list
  //   return task;
  // }

  /**
   * Update an existing task
   */
  // async updateTask(id: number, taskUpdate: TaskUpdate): Promise<Task> {
  //   const task = await lastValueFrom(this.taskService.updateTask(id, taskUpdate));
  //   this.reload(); // Refresh the list
  //   return task;
  // }

  /**
   * Delete a task
   */
  // async deleteTask(id: number): Promise<void> {
  //   await lastValueFrom(this.taskService.deleteTask(id));
  //   this.reload(); // Refresh the list
  // }
}
