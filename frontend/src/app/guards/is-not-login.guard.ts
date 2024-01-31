import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';


export const isNotLoginGuard: CanActivateFn = (route, state) => {
  const router= inject(Router)
  const userService= inject(UserService)

  if(!userService.getToken()){
    return true;

  }else{
    router.navigate(['/'])
    return false
  }
 };
