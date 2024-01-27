import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss'
})
export class NavigatorComponent  {




  visible: boolean=false

  changeVisibile(): void {
    this.visible = !this.visible
  
  }
 
}
