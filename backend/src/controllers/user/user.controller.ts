import {
    Body, Controller,
    Delete,
    FileTypeValidator
    , Get,
    MaxFileSizeValidator,
    ParseFilePipe, Post,
    Put, Query, Req, UploadedFile,
    UseGuards, UseInterceptors,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserLoginDto } from 'src/dtos/user.login.dto';
import { UserSubscribeDto } from 'src/dtos/user.subscribe.dto';
import { UserUpdateDto } from 'src/dtos/user.update.dto';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { MailGuard } from 'src/guards/mail/mail.guard';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
@ApiTags('User routes')

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

    @ApiBearerAuth()
    @Get('me')
    @UseGuards(JwtGuard)
    
    async getMe(@Req() req: Request) {
        return await this.userService.get(req["user"]._id);

    }

    @ApiBearerAuth()
    @Put('update')
    @UseGuards(JwtGuard)
    async updateInfo(@Req() req: Request, @Body() body: UserUpdateDto) {


        return await this.userService.update(req["user"]._id, body.name, body.mail)

    }

    @ApiBearerAuth()
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

    @ApiBearerAuth()
    @Delete('delete')
    @UseGuards(JwtGuard)
    async deleteUser(@Req() req: Request) {
        return await this.userService.delete(req["user"]._id)
    }

    @ApiBearerAuth()
    @Get('validate')
    @UseGuards(JwtGuard)
    async validateMail(@Req() req: Request, @Query('token') token: string) {
        return await this.userService.validateMail(req["user"]._id, token)

    }
}
