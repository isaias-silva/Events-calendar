import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Event } from '../../../../interfaces/event.interface';
import { CreateEventComponent } from '../create-event/create-event.component';
import { EventCreate } from '../../../../interfaces/event.create.interface';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DialogGlobalComponent } from '../dialog-global/dialog-global.componen';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatCheckboxModule],
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.scss'
})
export class UpdateEventComponent {

  constructor(private dialogRef: MatDialogRef<UpdateEventComponent>, @Inject(MAT_DIALOG_DATA) public data: Event) { }

  eventForm = new FormGroup({
    title: new FormControl<string | undefined>(this.data.title, Validators.required),
    description: new FormControl<string | undefined>(this.data.describ, Validators.required),

    endDate: new FormControl<Date>(new Date(this.data.endDate), Validators.required),
    endTime: new FormControl<string | undefined>(this.generateHoursString(new Date(this.data.endDate)), Validators.required),

    initDate: new FormControl<Date>(new Date(this.data.initDate), Validators.required),
    initTime: new FormControl<string | undefined>(this.generateHoursString(new Date(this.data.initDate)), Validators.required),

    isPrivate: new FormControl<boolean | undefined>(this.data.isPrivate, Validators.required),

  });
  

  generateHoursString(date: Date) {

    return `${date.getHours()}:${date.getMinutes()}`
  }

  onSave(): void {
    console.log('entrou')
    if (this.eventForm.valid) {

      const { title, description, isPrivate } = this.eventForm.value


      const initDateObject: Date = this.makeDate(this.eventForm.get("initDate")?.value, this.eventForm.get("initTime")?.value)
      const endDateObject: Date = this.makeDate(this.eventForm.get("endDate")?.value, this.eventForm.get("endTime")?.value)

      if (!this.validTime(initDateObject, endDateObject)) {

        return
      }

      const formatEvent = {
        title,
        describ: description,
        initString: initDateObject.toISOString(),
        endString: endDateObject.toISOString(),
        isPrivate
      }
      if (formatEvent.title != this.data.title || formatEvent.describ != this.data.describ || formatEvent.initString != this.data.initDate || formatEvent.endString != this.data.endDate || formatEvent.isPrivate != this.data.isPrivate) {

        this.dialogRef.close(formatEvent);
      }


    }
  }


  onCancel(): void {

    this.dialogRef.close();
  }

  validTime(first: Date, end: Date): boolean {
    const today = new Date()

    if (today >= first) {

      return false
    }
    if (first >= end) {

      return false
    }

    return true
  }
  makeDate(date: Date | any, hours: string | any) {

    const newDate = date
    const [horas, minutos, segundos] = hours.split(":").map(Number);

    newDate.setHours(horas);
    newDate.setMinutes(minutos);

    return newDate
  }
}
