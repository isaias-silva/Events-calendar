import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserData } from '../../../../interfaces/user.data.interface';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  providers: [EventsService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  constructor(private eventService: EventsService, private dialogRef: MatDialogRef<UserListComponent>, @Inject(MAT_DIALOG_DATA) public data: { _id: string, users: UserData[], type: 'applicant' | 'participant' }) {

  }

  accept(user: string) {
    if (this.data.type != 'applicant') {
      return
    }
    this.eventService.approveApplicant(this.data._id, user).subscribe(() => {
      this.dialogRef.close(true)
    })
  }
  recuse(user: string) {
    if (this.data.type != 'applicant') {
      return
    }
    this.eventService.recuseApplicant(this.data._id, user).subscribe(() => {
      this.dialogRef.close(true)
    })
  }
}
