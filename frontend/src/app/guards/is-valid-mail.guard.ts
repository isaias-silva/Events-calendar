import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const isValidMailGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router)
  const userService = inject(UserService)



 const user= await userService.getUser().toPromise()

 if(user?.mailVerify){
  return true
 }

 router.navigate(['/'])
 return false

};
