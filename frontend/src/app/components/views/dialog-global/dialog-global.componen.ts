import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-global',
  standalone: true,
  imports: [],
  templateUrl: './dialog-global.component.html',
  styleUrl: './dialog-global.component.scss'
})
export class DialogGlobalComponent {

  constructor(public dialogRef: MatDialogRef<DialogGlobalComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
