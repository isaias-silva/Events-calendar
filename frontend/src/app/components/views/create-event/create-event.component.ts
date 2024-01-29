// event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventCreate } from '../../../../interfaces/event.create.interface';

@Component({
  standalone: true,
  selector: 'app-create-event-dialog',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatCheckboxModule]
})
export class CreateEventComponent {
  eventForm: FormGroup;
  

  constructor(
    private dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    this.eventForm = new FormGroup({
      title: new FormControl<string | undefined>('', Validators.required),
      description: new FormControl<string | undefined>('', Validators.required),
      endDate: new FormControl<Date>(new Date(), Validators.required),
      endTime: new FormControl<string | undefined>('', Validators.required),
      initDate: new FormControl<Date>(new Date(), Validators.required),
      initTime: new FormControl<string | undefined>('', Validators.required),
      isPrivate: new FormControl<boolean | undefined>(false, Validators.required),

    });
  }

  onSave(): void {

    if (this.eventForm.valid) {
      const { title, description,isPrivate } = this.eventForm.value

      const initDateObject: Date = this.makeDate(this.eventForm.get("initDate")?.value, this.eventForm.get("initTime")?.value)
      const endDateObject: Date = this.makeDate(this.eventForm.get("endDate")?.value, this.eventForm.get("endTime")?.value)

      if (!this.validTime(initDateObject, endDateObject)) {

        return
      }

      const formatEvent:EventCreate = {
        title,
        describ: description,
        initString:initDateObject.toISOString(),
        endString:initDateObject.toISOString(),
        isPrivate
      }

      this.dialogRef.close(formatEvent);

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