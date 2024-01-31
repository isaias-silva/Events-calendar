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
    this.myEvents = []
    if (this.type == "me") {


      this.eventService.getEvents(this.type).subscribe(response => {
        this.myEvents = response;
        this.onSelectedDate(new Date())
      });
    } else {
      this.eventService.getEventWhere('participate').subscribe(response => {
        this.myEvents = response;
        this.onSelectedDate(new Date())
      });
    }
  }

  myEvents: Event[] = [];

  eventsInDate: Event[] = [];

  selected: Date | DateRange<Date> | null = new Date();


  type: "me" | "partipant" = "me"


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
      const initDate = new Date(event.initDate);
      const endDate = new Date(event.endDate);

      initDate.setHours(0)
      initDate.setMinutes(0)
      date.setHours(0)
      date.setMinutes(0)

      return (date.getTime() == initDate.getTime()) || (date >= initDate && date <= endDate);
    });
  }

  getEventsInDate(date: Date): Event[] {
    return this.myEvents.filter((event) => {


      const initDate = new Date(event.initDate);
      const endDate = new Date(event.endDate);

      initDate.setHours(0)
      initDate.setMinutes(0)
      date.setHours(0)
      date.setMinutes(0)

      return (date.getTime() == initDate.getTime()) || (date >= initDate && date <= endDate);
    });
  }
  onSelectedDate(event: Date | null) {
    if (event)
      this.eventsInDate = this.getEventsInDate(event)

  }


}
