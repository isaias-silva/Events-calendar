import { Component } from '@angular/core';
import { DateRange, MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { ViewEncapsulation } from "@angular/core";


@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [MatCardModule, MatDatepickerModule],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent {
  selected: Date | DateRange<Date> | null = null

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {

    const date = cellDate.getDate();

    if (view == 'month') {
      return (date == 1) ? 'mark' : "";
    }

    return "";
  }
}
