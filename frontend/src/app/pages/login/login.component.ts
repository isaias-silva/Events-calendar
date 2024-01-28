import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {DialogGlobalComponent } from '../../components/views/dialog-global/dialog-global.componen';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, MatDialogModule],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {



  form = new FormGroup({
    mail: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  })

  constructor(private userService: UserService, public dialog: MatDialog, private router: Router) { }
  submitForm() {
    if (this.form.invalid) {
      return
    }
    const mail = this.form.get("mail")?.value
    const password = this.form.get("password")?.value

    if (mail && password)
      this.userService.login(mail, password).subscribe((response) => {

        this.openDialogLogin(response.message, true)
      }, (responseError: HttpErrorResponse) => {

        const { error } = responseError
        if (error.message) {
          this.openDialogLogin(error.message, false)
        }
       
      })
  }


  openDialogLogin(message: string, success: boolean): void {

    const dialogRef = this.dialog.open(DialogGlobalComponent, {
      data: { message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (success)
        this.router.navigate(['/'])
    });
  }
}
