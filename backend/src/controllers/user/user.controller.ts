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
import { UserService } from 'src/services/user/user.service';

@Controller('user')
@ApiTags('User routes')

export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('subscribe')
   
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 201, description: 'successful subscription' })
    
    async subscribeUser(@Body() body: UserSubscribeDto) {

        return await this.userService.subscribe(body.name, body.mail, body.password)
    }

    @Post('login')

    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 404, description: 'user not found' })
    @ApiResponse({ status: 201, description: 'successful login, return a access token' })

    async loginUser(@Body() body: UserLoginDto) {

        return await this.userService.login(body.mail, body.password)
    }

    @ApiBearerAuth()
    @Get('me')
    @UseGuards(JwtGuard)

    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 200, description: 'user info' })
    @ApiResponse({ status: 404, description: 'user not found' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
   
    async getMe(@Req() req: Request) {
        return await this.userService.get(req["user"]._id);

    }

    @ApiBearerAuth()
    @Get('all')
    @UseGuards(JwtGuard)

    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 200, description: 'all users ' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
   
    async getAll(@Req() req: Request) {
        return await this.userService.getAllUsers()

    }

    @ApiBearerAuth()
    @Get('validate')
    @UseGuards(JwtGuard)
   
    @ApiResponse({ status: 200, description: 'user email validated' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 401, description: 'validate code incorrect' })
    @ApiResponse({ status: 404, description: 'user not found' })
   

    async validateMail(@Req() req: Request, @Query('token') token: string) {
        return await this.userService.validateMail(req["user"]._id, token)

    }

    @ApiBearerAuth()
    @Put('update')
    @UseGuards(JwtGuard)
    
    @ApiResponse({ status: 200, description: 'user updated' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description:  'error in body of request' })
    @ApiResponse({ status: 404, description: 'user not found' })
   
    async updateInfo(@Req() req: Request, @Body() body: UserUpdateDto) {


        return await this.userService.update(req["user"]._id, body.name)

    }

    @ApiBearerAuth()
    @Put('update/profile')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))


    @ApiResponse({ status: 200, description: 'user profile updated' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description:  'error in body of request' })
    @ApiResponse({ status: 404, description: 'user not found' })
   


    async updateProfile(@Req() req: Request, @UploadedFile(new ParseFilePipe({
        validators: [
            new FileTypeValidator({ fileType: 'image' }),

        ],

    })) file?: Express.Multer.File) {

        return await this.userService.updateProfile(req["user"]._id, req["domain"], file.buffer)

    }

    @ApiBearerAuth()
    @Delete('delete')
    @UseGuards(JwtGuard)

    @ApiResponse({ status: 200, description: 'user deleted' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 404, description: 'user not found' })
   
    async deleteUser(@Req() req: Request) {
        return await this.userService.delete(req["user"]._id)
    }


}
