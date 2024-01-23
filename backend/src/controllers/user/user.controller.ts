import {
    Body, Controller,
    FileTypeValidator
    , Get,
    MaxFileSizeValidator,
    ParseFilePipe, Post,
    Put, Req, UploadedFile,
    UseGuards, UseInterceptors,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
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
    @Put('update')
    @UseGuards(JwtGuard)

    async updateInfo(@Req() req: Request, @Body() body) {


        return await this.userService.update(req["user"]._id, body.name, body.mail)

    }

    @Put('update/profile')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))

    async updateProfile(@Req() req: Request, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 100000 }),
            new FileTypeValidator({ fileType: 'image' }),

        ],
    })) file?: Express.Multer.File) {
        const protocol = req.protocol;
        const host = req.get('host');
        const domain = `${protocol}://${host}`;
        return await this.userService.updateProfile(req["user"]._id, domain, file.buffer)

    }
}
