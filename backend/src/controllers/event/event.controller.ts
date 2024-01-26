import { Body, Controller, Delete, FileTypeValidator, Get, Inject, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { EventApproveDto } from 'src/dtos/event.approve.dto';
import { EventCreateDto } from 'src/dtos/event.create.dto';
import { EventResponseApproveDto } from 'src/dtos/event.response.invite.dto';
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

    @Post('unsubscribe')
    async unsubcribeEvent(@Req() req: Request, @Body() event: EventSubscribeDto) {
        return await this.eventService.unsubscribe(req["user"]._id, event._id)
    }
    @Post('/approve')
    async approveInEvent(@Req() req: Request, @Body() data: EventApproveDto) {
        return await this.eventService.approve(req["user"]._id, data.user, data._id)
    }
    @Post('/send/invite')
    async inviteEvent(@Req() req: Request, @Body() data: EventApproveDto) {

        return await this.eventService.toInvite(req["user"]._id, data.user, data._id)
    }
    @Post('/accept/invite')
    async inviteAccept(@Req() req: Request, @Body() data: EventResponseApproveDto) {

        return await this.eventService.respondToInvitation(req["user"]._id, data._id, data.accept)
    }
    @Get('me')
    async getMyEvents(@Req() req: Request) {
        return await this.eventService.get(req["user"]._id, false)
    }

    @Get('all')
    async getAllEvents(@Req() req: Request) {
        return await this.eventService.get(req["user"]._id, true)
    }

    @Get('/:id')
    async getEvent(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.get(req["user"]._id, false, id)
    }

    @Get('/applicants/:id')
    async getApplicants(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.getApplicants(req["user"]._id, id)
    }

    @Get('/participants/:id')
    async getParticipants(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.getParticipants(req["user"]._id, id)
    }

    @Get('/guests/:id')
    async getGuests(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.getGuests(req["user"]._id, id)
    }

    @Get('/where/participate')
    async getEventsWhereParticipant(@Req() req: Request) {
        return await this.eventService.getSubscribeOrApplicantsOrGuestEvents(req["user"]._id, "participant")
    }
    @Get('/where/applicate')
    async getEventsWhereApplicant(@Req() req: Request) {
        return await this.eventService.getSubscribeOrApplicantsOrGuestEvents(req["user"]._id, "applicant")
    }
    @Get('/where/guest')
    async getEventsWhereGuest(@Req() req: Request) {
        return await this.eventService.getSubscribeOrApplicantsOrGuestEvents(req["user"]._id, "guest")
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



        return await this.eventService.updateBackground(req["user"]._id, req["domain"], id, file.buffer)

    }

    @Delete('cancel/:id')
    async cancelEvent(@Req() req: Request, @Param('id') id: string) {

        return await this.eventService.delete(req["user"]._id, id)
    }



}
