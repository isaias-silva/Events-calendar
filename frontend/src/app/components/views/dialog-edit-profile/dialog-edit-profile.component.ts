import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [UserService],
  templateUrl: './dialog-edit-profile.component.html',
  styleUrl: './dialog-edit-profile.component.scss'
})
export class DialogEditProfileComponent {
  form = new FormGroup(
    {
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(4)])
    }
  )
  constructor(private userService: UserService, public dialogRef: MatDialogRef<DialogEditProfileComponent>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  update() {
    if (this.form.invalid) {
      return
    }
    const name = this.form.get('name')?.value
    if (name)
      this.userService.updateName(name).subscribe(response => {
        console.log(response)
        this.onNoClick()
      })
  }
}
