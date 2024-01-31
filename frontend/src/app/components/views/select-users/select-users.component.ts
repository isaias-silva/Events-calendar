import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { EventsService } from '../../../services/events.service';
import { UserData } from '../../../../interfaces/user.data.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [MatInputModule, CommonModule, MatInputModule, MatButtonModule],
  providers: [UserService, EventsService],
  templateUrl: './select-users.component.html',
  styleUrl: './select-users.component.scss'
})
export class SelectUsersComponent implements OnInit {
  constructor(private userServices: UserService,
    private eventService: EventsService,
    private dialogRef: MatDialogRef<SelectUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { _id: string }) { }

  ngOnInit(): void {
    this.userServices.getAll().subscribe((response) => {
      this.globalUsers = response
      this.filter()
    })
  }
  filter() {
    this.eventService.getApplicants(this.data._id).subscribe((res) => {
      this.globalUsers = this.globalUsers.filter(user => !res.find(us => us._id == user._id))
      this.users = this.globalUsers
    })
    this.eventService.getParticipants(this.data._id).subscribe((res) => {
      this.globalUsers = this.globalUsers.filter(user => !res.find(us => us._id == user._id))
      this.users = this.globalUsers
    })
    this.eventService.getGuests(this.data._id).subscribe((res) => {
      this.globalUsers = this.globalUsers.filter(user => !res.find(us => us._id == user._id))
      this.users = this.globalUsers
    })


  }
  changeFilter(event: any) {
    console.log(event.target.value)
    this.users = this.globalUsers.filter((user) => user.name.toLowerCase().includes(event.target.value.toLowerCase()))
  }

  invite(user: string) {
    this.eventService.sendInvite(this.data._id, user).subscribe((res) => {
      this.dialogRef.close(true)
    })
  }
  users: UserData[] = []
  private globalUsers: UserData[] = []
}
