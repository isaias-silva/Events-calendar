import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserLoginDto } from 'src/dtos/user.login.dto';
import { UserSubscribeDto } from 'src/dtos/user.subscribe.dto';
import { JwtGuard } from 'src/guards/jwt.guard.ts/jwt.guard.ts.guard';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('subscribe')
    async subscribeUser(@Body() body: UserSubscribeDto) {

        return await this.userService.subscribe(body.name, body.mail, body.password)
    }

    @Post('login')
    async loginUser(@Body() body: UserLoginDto) {

        return await this.userService.login(body.mail, body.password)
    }

    @Get('me')
    @UseGuards(JwtGuard)
    async getMe(@Req() req: Request) {
        return await this.userService.get(req["user"]._id);

    }
}
