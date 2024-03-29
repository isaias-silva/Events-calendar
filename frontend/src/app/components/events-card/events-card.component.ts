import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Event } from '../../../interfaces/event.interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-events-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './events-card.component.html',
  styleUrl: './events-card.component.scss'
})
export class EventsCardComponent implements OnInit {

  constructor(private router: Router) {

  }

  redirect() {
    this.router.navigate([`event/${this.event?._id}`])
  }

  ngOnInit(): void {
    if (this.event) {
      this.event.describ = this.resume(this.event.describ)
      this.init = this.formatDateToString(this.event.initDate)
      this.end = this.formatDateToString(this.event.endDate)

    }
  }
  @Input() event: Event | undefined
  init: string | undefined
  end: string | undefined

  resume(text: string) {

    if (text.length > 15) {
      return text.substring(0, 15) + "...";

    }
    return text
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
