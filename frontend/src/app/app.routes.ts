import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { isLoginGuard } from './guards/is-login.guard';
import { LogoutComponent } from './pages/logout/logout.component';
import { isValidMailGuard } from './guards/is-valid-mail.guard';
import { EventsComponent } from './pages/events/events.component';
import { ValidateMailComponent } from './pages/validate-mail/validate-mail.component';
import { EventComponent } from './pages/event/event.component';
import { isNotLoginGuard } from './guards/is-not-login.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate:[isNotLoginGuard] },
    { path: 'register', component: RegisterComponent, canActivate:[isNotLoginGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [isLoginGuard, isValidMailGuard] },
    { path: '', component: HomeComponent, canActivate: [isLoginGuard] },
    { path: 'events/:type', component: EventsComponent, canActivate: [isLoginGuard, isValidMailGuard] },
    { path: 'verify', component: ValidateMailComponent, canActivate: [isLoginGuard] },
    { path: 'event/:id', component: EventComponent, canActivate: [isLoginGuard, isValidMailGuard] },
    { path: 'logout', component: LogoutComponent },

];
