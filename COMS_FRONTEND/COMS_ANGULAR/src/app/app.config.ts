import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes'; 
import { MockApiInterceptor } from './mock-api.interceptor';
import { environment } from './environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Enable DI for interceptors
    // Conditionally provide the mock interceptor for development
    environment.production ? [] : [
     { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true }
    ]
  ]
};