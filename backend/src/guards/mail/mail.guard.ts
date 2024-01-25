import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Responses } from 'src/enums/Responses';
import { UserService } from 'src/services/user/user.service';

@Injectable()
export class MailGuard implements CanActivate {
  constructor(@Inject(UserService) private readonly userService: UserService) { }
  async canActivate(
    context: ExecutionContext,
  ) {

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.get(request["user"]._id)
    if (!user.mailVerify) {
      throw new UnauthorizedException(Responses.USER_MAIL_NOT_VALIDATED);

    } else {

      return true;
    }
  }
}
