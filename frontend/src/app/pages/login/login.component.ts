import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogLoginComponent } from '../../components/views/login/dialog-login/dialog-login.component';
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

  constructor(private userService: UserService, public dialog: MatDialog,private router: Router) { }
  submitForm() {
    if (this.form.invalid) {
      return
    }
    const mail = this.form.get("mail")?.value
    const password = this.form.get("password")?.value

    if (mail && password)
      this.userService.login(mail, password).subscribe((response:any) => {
        this.openDialogSucess(response.message)
      }, (error) => {

        console.error("Erro na requisição:", error);
      })
  }

  openDialogSucess(message: string): void {
   
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      data: { message }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/'])
    });
  }
}
