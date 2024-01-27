import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './components/navigator/navigator.component';
import {MatNativeDateModule} from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavigatorComponent,MatNativeDateModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
