import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports:[RouterModule],
  providers:[UserService],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit{
  constructor(private userService:UserService,private router:Router){}
  ngOnInit(): void {
    this.userService.logout()
    this.router.navigate(['/login'])
  }

  
}
