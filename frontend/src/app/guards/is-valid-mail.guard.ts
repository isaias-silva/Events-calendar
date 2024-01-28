import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const isValidMailGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const userService = inject(UserService)

  let isValid: boolean = false

  userService.getUser().subscribe((user) => {
    isValid = user.mailVerify
  })

  if (!isValid) {
    router.navigate(['/'])
  }
  return isValid;
};
