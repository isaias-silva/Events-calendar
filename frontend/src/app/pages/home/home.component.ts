import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { UserData } from '../../../interfaces/user.data.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, ProfileComponent,CommonModule],
  providers: [UserService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) { }
  user: UserData | undefined;
  ngOnInit(): void {
    this.userService.getUser().subscribe((response) => {
      console.log(response)
      this.user = response
      if(!this.user.profile){
        this.user.profile="../../../assets/profile.jpg"
      }
    })
  }

}
