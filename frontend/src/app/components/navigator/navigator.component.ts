import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatIconModule,CommonModule],
  providers: [UserService],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss'
})
export class NavigatorComponent implements OnInit {
  constructor(private userServices:UserService){}
  ngOnInit(): void {
    this.visible=this.userServices.getToken()?true:false
  }

  max: boolean = false
  visible: boolean = true
  changeVisibile(): void {
    this.max = !this.max

  }

}
