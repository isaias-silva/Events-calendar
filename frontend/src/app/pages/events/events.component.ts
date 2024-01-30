import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { Event } from '../../../interfaces/event.interface';
import { EventsCardComponent } from "../../components/events-card/events-card.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateEventComponent } from '../../components/views/create-event/create-event.component';
import { EventCreate } from '../../../interfaces/event.create.interface';
import swal from 'sweetalert2';
@Component({
  selector: 'app-events',
  standalone: true,
  providers: [EventsService],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  imports: [RouterModule, CommonModule, EventsCardComponent, MatDialogModule]
})
export class EventsComponent implements OnInit {

  constructor(private router: Router, private eventsService: EventsService, public route: ActivatedRoute, public dialog: MatDialog) { }
  filter: 'me' | 'all' = 'me';
  title: string | undefined;
  events: Event[] = []
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const type = params.get('type');
      if (type == 'me' || type == 'all') {
        this.filter = type
        this.updateEvents()
      
      } else {
        this.router.navigate(['/'])
      }

    })
  }
  updateEvents(){
    this.eventsService.getEvents(this.filter).subscribe((eventsRes) => {
      console.log(eventsRes)
      this.events = eventsRes
    })
  }

  openDialogCreate() {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      minWidth: '50%',
      height: '100%'

    });

    dialogRef.afterClosed().subscribe((result?: EventCreate) => {
      if (result) {
        this.eventsService.createEvent(result).subscribe((response) => {
          console.log(response)
          this.updateEvents()
        })
      }
    });
  }
}



