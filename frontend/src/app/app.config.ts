import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideAnimations(), provideHttpClient(), importProvidersFrom(MatNativeDateModule),importProvidersFrom(SweetAlert2Module.forRoot())]
};
