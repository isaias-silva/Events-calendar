import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogGlobalComponent } from '../../components/views/dialog-global/dialog-global.componen';
import { HttpErrorResponse } from '@angular/common/http';
import swal from "sweetalert2"
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DialogModule, RouterModule],
  providers: [UserService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private userService: UserService, public dialog: MatDialog, private router: Router) { }

  form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    mail: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required),
    passwordRepite: new FormControl<string | null>(null, Validators.required)

  })

  submitForm() {

    if (this.form.invalid) {
      return
    }

    if (this.form.get("password")?.value != this.form.get("passwordRepite")?.value) {
      return
    }
    const { name, mail, password } = this.form.value
    if (name && mail && password)
      this.userService.register(name, mail, password).subscribe((response) => {
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
          }).then((result) => {
            this.router.navigate(['/'])
          })
        }

      })


  }

}
