import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { Event } from '../../../interfaces/event.interface';
import { EventsCardComponent } from "../../components/events-card/events-card.component";
@Component({
    selector: 'app-events',
    standalone: true,
    providers: [EventsService],
    templateUrl: './events.component.html',
    styleUrl: './events.component.scss',
    imports: [RouterModule, CommonModule, EventsCardComponent]
})
export class EventsComponent implements OnInit {

  constructor(private router: Router, private eventsService: EventsService, public route: ActivatedRoute) { }
  filter: 'me' | 'all' = 'me';
  title: string | undefined;
  events: Event[] = []
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const type = params.get('type');
      if (type == 'me' || type == 'all') {
        this.filter = type
        this.title = type == "me" ? "Meus eventos" : "Eventos"
        this.eventsService.getEvents(type).subscribe((eventsRes) => {
          console.log(eventsRes)
          this.events = eventsRes
        })
      } else {
        this.router.navigate(['/'])
      }

    })
  }


}
