import { Component } from '@angular/core';
import { TaskList } from './components/task-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskList],
  template: `
    <div class="container">
      <h1>Task Manager - API-First Angular App</h1>
      <app-task-list></app-task-list>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 2rem;
    }
  `]
})
export class App {
  title = 'Task Manager';
}
