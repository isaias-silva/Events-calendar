import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit, ViewChild } from '@angular/core';
import { DateRange, MatCalendar, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { ViewEncapsulation } from "@angular/core";
import { EventsService } from '../../services/events.service';
import { Event } from '../../../interfaces/event.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [MatCardModule, MatDatepickerModule, CommonModule, MatRadioModule, FormsModule],
  providers: [EventsService],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {


  constructor(private eventService: EventsService) { }

  ngOnInit(): void {

    this.updateEvents()


  }


  updateEvents() {
    alert(this.type)
    if (this.type == "me") {

      this.eventService.getEvents(this.type).subscribe(response => {
        this.myEvents = response;
        this.onSelectedDate(new Date())
      });
    }else {
      
    }
  }

  myEvents: Event[] = [];
  eventsInDate: Event[] = [];
  selected: Date | DateRange<Date> | null = new Date();


  @Input() type: "me" | "partipant" = "me"


  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view == 'month') {
      const eventInit = this.checkDateEvent(cellDate);

      if (eventInit) {
        return "mark init";
      }
    }

    return "";
  }

  checkDateEvent(date: Date): Event | undefined {
    return this.myEvents.find((event) => {
      const dateEvent = new Date(event.initDate);

      return (
        dateEvent.getFullYear() === date.getFullYear() &&
        dateEvent.getMonth() === date.getMonth() &&
        dateEvent.getDate() === date.getDate()
      );
    });
  }

  getEventsInDate(date: Date): Event[] {
    return this.myEvents.filter((event) => {
      const dateEvent = new Date(event.initDate);

      return (
        dateEvent.getFullYear() === date.getFullYear() &&
        dateEvent.getMonth() === date.getMonth() &&
        dateEvent.getDate() === date.getDate()
      );
    });
  }
  onSelectedDate(event: Date | null) {
    if (event)
      this.eventsInDate = this.getEventsInDate(event)

  }


}
