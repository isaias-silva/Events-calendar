import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @Input() image: string | undefined;

  imageUpload: string | undefined;

  changeImage(event: any) {
    console.log(event.target.files[0])
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.includes("image") == false) {
        this.imageUpload = undefined

        this.image = "../../../assets/corrupted.png"
      } else {
        this.image = URL.createObjectURL(event.target.files[0]);
      }

    }

  }
}
