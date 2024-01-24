import { Body, Controller, Delete, FileTypeValidator, Get, Inject, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { EventCreateDto } from 'src/dtos/event.create.dto';
import { EventSubscribeDto } from 'src/dtos/event.subscribe.dto';
import { EventUpdateDto } from 'src/dtos/event.update.dto';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { MailGuard } from 'src/guards/mail/mail.guard';
import { EventService } from 'src/services/event/event.service';

@Controller('events')
@ApiTags('Events and invitation')
@ApiBearerAuth()
@UseGuards(JwtGuard, MailGuard)

export class EventController {
    constructor(@Inject(EventService) private readonly eventService: EventService) { }
    @Post('create')
    async createEvent(@Req() req: Request, @Body() event: EventCreateDto) {
        return await this.eventService.create(req["user"]._id, event)
    }

    @Post('subscribe')
    async subscribeEvent(@Req() req: Request, @Body() event: EventSubscribeDto) {
        return await this.eventService.subscribe(req["user"]._id, event._id)
    }

    @Get('get/me')
    async getMyEvents(@Req() req: Request) {
        return await this.eventService.get(req["user"]._id, false)
    }

    @Get('get/all')
    async getAllEvents(@Req() req: Request) {
        return await this.eventService.get(req["user"]._id, true)
    }

    @Get('get/:id')
    async getEvent(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.get(req["user"]._id, false, id)
    }
    @Put('update/:id')
    async updateEvent(@Req() req: Request, @Param('id') id: string, @Body() event: EventUpdateDto) {
        return await this.eventService.update(req["user"]._id, id, event)
    }

    @Put("update/background/:id")
    @UseInterceptors(FileInterceptor('file'))
    async updateProfile(@Req() req: Request, @Param('id') id: string, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 100000 }),
            new FileTypeValidator({ fileType: 'image' }),

        ],
    })) file: Express.Multer.File) {
        const protocol = req.protocol;
        const host = req.get('host');
        const domain = `${protocol}://${host}`;

        return await this.eventService.updateBackground(req["user"]._id, domain, id, file.buffer)

    }

    @Delete('cancel/:id')
    async cancelEvent(@Req() req: Request, @Param('id') id: string) {

        return await this.eventService.delete(req["user"]._id, id)
    }


}
