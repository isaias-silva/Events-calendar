import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  providers: [UserService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Input() image: string | undefined;

  imageUpload: string | undefined;

  constructor(private userService: UserService) { }
 changeImage(event: any) {
    console.log(event.target.files[0])
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.includes("image") == false) {

        this.imageUpload = undefined

        this.image = "../../../assets/corrupted.png"
      } else {
        this.image = URL.createObjectURL(event.target.files[0]);
       this.userService.updateProfileUser(event.target.files[0]).subscribe((response)=>{
        console.log(response)
       })
      }

    }

  }
  
}
