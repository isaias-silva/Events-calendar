import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-validate-mail',
  standalone: true,
  imports: [RouterModule],
  providers: [UserService],
  templateUrl: './validate-mail.component.html',
  styleUrl: './validate-mail.component.scss'
})
export class ValidateMailComponent {
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
      
        this.userService.validateMail(token).subscribe((response)=>{
          this.userService.validateMail(token)
        })
      }
     
      this.router.navigate(['/'])
   
    });
  }
}
