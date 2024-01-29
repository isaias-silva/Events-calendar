import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatIconModule,CommonModule,RouterModule,MatButtonModule],
  providers: [UserService],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss'
})
export class NavigatorComponent implements OnInit {
  constructor(private userServices:UserService, private router:Router){}
  ngOnInit(): void {
    this.visible=this.userServices.getToken()?true:false
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.visible = this.userServices.getToken() ? true : false;
      }
    });
  }

  max: boolean = false
  visible: boolean = true
  changeVisibile(): void {
    this.max = !this.max

  }

}
