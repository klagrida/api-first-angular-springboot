import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { BASE_PATH } from './app/generated';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: BASE_PATH, useValue: 'http://localhost:8080/api/v1' }
  ]
}).catch(err => console.error(err));
