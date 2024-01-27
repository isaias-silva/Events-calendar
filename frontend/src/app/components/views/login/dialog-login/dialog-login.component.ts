import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-login',
  standalone: true,
  imports: [],
  templateUrl: './dialog-login.component.html',
  styleUrl: './dialog-login.component.scss'
})
export class DialogLoginComponent {

  constructor(public dialogRef: MatDialogRef<DialogLoginComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
