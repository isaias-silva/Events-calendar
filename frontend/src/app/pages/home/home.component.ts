import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { UserData } from '../../../interfaces/user.data.interface';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogEditProfileComponent } from '../../components/views/dialog-edit-profile/dialog-edit-profile.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, ProfileComponent,CommonModule,MatDialogModule],
  providers: [UserService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService , public dialog: MatDialog) { }
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

  openDialogEdit(): void {

    const dialogRef = this.dialog.open(DialogEditProfileComponent, {
    
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
}
