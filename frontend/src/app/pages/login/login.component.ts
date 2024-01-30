import { Component } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, MatDialogModule, ],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {



  form = new FormGroup({
    mail: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  })

  constructor(private userService: UserService, private router: Router) { }
  submitForm() {
    if (this.form.invalid) {
      return
    }
    const mail = this.form.get("mail")?.value
    const password = this.form.get("password")?.value

    if (mail && password)
      this.userService.login(mail, password).subscribe((response) => {

        swal.fire({

          text: response.message,
          showCloseButton: false,
          showConfirmButton: false,
          icon: 'success'
        }).then((result) => {
          this.router.navigate(['/'])
        })
      }, (responseError: HttpErrorResponse) => {

        const { error } = responseError
        if (error.message) {
          swal.fire({

            text: error.message,
            showCloseButton: false,
            showConfirmButton: false,
            icon: 'error'
          })
        }

      })
  }


}
