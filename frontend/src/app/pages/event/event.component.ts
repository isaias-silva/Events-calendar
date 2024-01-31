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
import { UpdateEventComponent } from '../../components/views/update-event/update-event.component';
import { EventCreate } from '../../../interfaces/event.create.interface';
import swal from 'sweetalert2';
import { UserListComponent } from '../../components/views/user-list/user-list.component';
import { SelectUsersComponent } from '../../components/views/select-users/select-users.component';

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

  backgroundUpload: string | undefined

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


      }, (error) => {
        console.log(error)
        this.router.navigate(['/'])
      })
    } else if (this.event) {
      this.eventsService.getEvent(this.event._id).subscribe((event) => {
        this.event = event
        this.setStringDates()
        this.setIsMe()

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

      this.isMe = response._id == this.event?.owner

      this.setGlobalDataForEvent()

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
        console.log(response)
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

    } else if (this.event) {
      this.imParticipant
      this.eventsService.getEventWhere('participate').subscribe((res) => {
        const is = res.find(event => event._id == this.event?._id)

        this.imParticipant = is ? true : false

      })
      this.eventsService.getEventWhere('applicate').subscribe((res) => {
        const is = res.find(event => event._id == this.event?._id)
        if (is) {
          this.imApplicant = is ? true : false
        }
      })
      this.eventsService.getEventWhere('guest').subscribe((res) => {
        const is = res.find(event => event._id == this.event?._id)
        if (is) {
          this.imGuest = is ? true : false
        }
      })
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

  changeImage(event: any) {
    console.log(event.target.files[0])
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type.includes("image") == false) {

        return
      } else {
        this.backgroundUpload = URL.createObjectURL(event.target.files[0]);
        console.log(this.backgroundUpload)
        if (this.event) {

          this.eventsService.eventUpdateBackground(this.event._id, event.target.files[0]).subscribe((response) => {
            console.log(response)
            this.updateEvent()
          })
        }
      }

    }


  }


  deleteEvent() {
    if (this.event) {
      swal.fire({
        text: `tem certeza que deseja encerrar o evento "${this.event.title}" ? (os participantes serão informados)`
        , icon: 'warning',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Sim, encerrar!',
        denyButtonText: 'Cancelar'
      }).then(response => {
        if (response.isConfirmed) {
          if (this.event) {

            this.eventsService.deleteEvent(this.event._id).subscribe(() => {
              this.router.navigate(['/events/me'])
            })
          }
        }

      })
    }
  }
  action() {

    if (!this.event) {
      return
    }
    if (this.isMe) {
      return this.openListGuest()
    }

    if (this.imGuest) {
      this.eventsService.acceptInvite(this.event._id, true).subscribe((res) => {
        location.reload()
      })
      return
    }

    if (this.imParticipant || this.imApplicant) {
      this.eventsService.unsubscribeEvent(this.event._id).subscribe(() => {
        this.updateEvent()
      })

    } else {
      this.eventsService.subscribeEvent(this.event._id).subscribe(() => {
        this.updateEvent()
      })
    }

  }


  recuse() {

    if (this.imGuest && this.event) {

      this.eventsService.acceptInvite(this.event._id, false).subscribe((res) => {
        location.reload()
      })
    }
  }
  openList(type: 'participant' | 'applicant') {
    const dialog = this.dialog.open(UserListComponent, {
      data: { _id: this.event?._id, type, users: type == 'participant' ? this.participants : this.applicants },
      maxHeight: '100%',
      minHeight: '200px',
      width: '700px',
    })

    dialog.afterClosed().subscribe((update: boolean) => {
      if (update == true) {
        this.updateEvent()
      }
    })
  }
  openListGuest() {
    if (!this.isMe) {
      return
    }
    const dialog = this.dialog.open(SelectUsersComponent, {
      maxHeight: '100%',
      minHeight: '200px',
      width: '700px',
      data: { _id: this.event?._id }
    })
    dialog.afterClosed().subscribe((update) => {
      if (update == true) {
        this.updateEvent()
      }
    })
  }
}
