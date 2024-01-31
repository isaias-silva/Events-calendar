import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { UserData } from '../../../interfaces/user.data.interface';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogEditProfileComponent } from '../../components/views/dialog-edit-profile/dialog-edit-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { EventsService } from '../../services/events.service';
import { Event } from '../../../interfaces/event.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, ProfileComponent, CommonModule, MatDialogModule, MatIconModule],
  providers: [UserService, EventsService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService,
    private eventService: EventsService, public dialog: MatDialog) { }

  user: UserData | undefined;
  eventsWhereImParticipant: Event[] = []
  eventsWhereImApplicant: Event[] = []
  eventsWhereImGuest: Event[] = []


  ngOnInit(): void {
    this.updateUser()
  }

  updateUser() {
    this.userService.getUser().subscribe((response) => {
      console.log(response)
      this.user = response
      if (!this.user.profile) {
        this.user.profile = "../../../assets/profile.jpg"
      }

    })
    this.eventService.getEventWhere('participate').subscribe(res => this.eventsWhereImParticipant = res)
    this.eventService.getEventWhere('guest').subscribe(res => this.eventsWhereImGuest = res)
    this.eventService.getEventWhere('applicate').subscribe(res => this.eventsWhereImApplicant = res)
 
  }
  openDialogEdit(): void {

    const dialogRef = this.dialog.open(DialogEditProfileComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateUser()
    });
  }
}
