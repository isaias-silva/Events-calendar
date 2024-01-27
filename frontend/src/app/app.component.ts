import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './components/navigator/navigator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavigatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
