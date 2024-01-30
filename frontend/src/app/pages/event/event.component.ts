import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { Event } from '../../../interfaces/event.interface';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../interfaces/user.data.interface';
import { MatTableModule } from '@angular/material/table';
import { CreateEventComponent } from '../../components/views/create-event/create-event.component';
import { DialogGlobalComponent } from '../../components/views/dialog-global/dialog-global.componen';
import { UpdateEventComponent } from '../../components/views/update-event/update-event.component';
import { EventCreate } from '../../../interfaces/event.create.interface';
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [RouterModule, DialogModule, MatButtonModule, MatIconModule, CommonModule, MatTableModule],
  providers: [EventsService, UserService],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'

})
export class EventComponent implements OnInit {
  constructor(private router: Router,
    public dialog: MatDialog,
    private eventsService: EventsService,
    public route: ActivatedRoute,
    private userService: UserService) { }

  event: Event | undefined
  isMe: boolean = false
  imParticipant: boolean = false
  imApplicant: boolean = false
  imGuest: boolean = false

  dateStringInit: string | undefined
  dateStringEnd: string | undefined
  participants: UserData[] = []
  applicants: UserData[] = []
  guests: UserData[] = []

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      const id = params.get('id');
      if (id) {

        this.updateEvent(id)

      } else {
        this.router.navigate(['/'])
      }

    })
  }
  updateEvent(id?: string) {
    if (id) {

      const eventId = id
      this.eventsService.getEvent(eventId).subscribe((event) => {
        this.event = event
        console.log(event)
        this.setStringDates()
        this.setIsMe()
        this.setParticipants()

      }, (error) => {
        console.log(error)
        this.router.navigate(['/'])
      })
    } else if (this.event) {
      this.eventsService.getEvent(this.event._id).subscribe((event) => {
        this.event = event
        this.setStringDates()
        this.setIsMe()
        this.setParticipants()
      })
    }
  }

  setStringDates() {
    if (this.event) {
      this.dateStringInit = this.formatDateToString(this.event.initDate)
      this.dateStringEnd = this.formatDateToString(this.event.endDate)
    }

  }
  setIsMe() {
    this.userService.getUser().subscribe((response) => {
      console.log(response)
      this.isMe = response._id == this.event?.owner
      if (this.isMe) {

      }
    })
  }

  setParticipants() {
    if (this.event) {
      this.eventsService.getParticipants(this.event._id).subscribe((response) => {
        this.participants = response
      })
    }
  }

  setApplicants() {
    if (this.event) {
      this.eventsService.getApplicants(this.event._id).subscribe((response) => {
        this.applicants = response
      })
    }
  }
  setGuests() {
    if (this.event) {
      this.eventsService.getGuests(this.event._id).subscribe((response) => {
        this.guests = response
      })
    }
  }

  setGlobalDataForEvent() {
    if (this.event && this.isMe) {
      this.setParticipants()
      this.setApplicants()
      this.setGuests()

    }
  }

  openEditorModal() {

    const dialogRef = this.dialog.open(UpdateEventComponent, {
      height: '100%',
      width: '700px',
      data: this.event
    });
    dialogRef.afterClosed().subscribe((result: EventCreate) => {
      if (result && this.event) {
        this.eventsService.eventUpdate(this.event._id, result).subscribe((response) => {
          console.log(response)
          this.updateEvent()
        }, (err) => {
          console.log(err)
        })
      }
    });

  }
  formatDateToString(dateString: string): string {
    const data = new Date(dateString)
    const day = this.addZero(data.getDate());
    const month = this.addZero(data.getMonth() + 1);
    const year = data.getFullYear();

    return `${day}/${month}/${year}`;
  }

  addZero(numberDate: number): string {
    return numberDate < 10 ? `0${numberDate}` : `${numberDate}`;
  }
}
