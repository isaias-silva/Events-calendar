import { Body, Controller, Delete, FileTypeValidator, Get, Inject, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

    @ApiResponse({ status: 201, description: ' event created' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description: 'error in body of request' })


    async createEvent(@Req() req: Request, @Body() event: EventCreateDto) {
        return await this.eventService.create(req["user"]._id, event)
    }

    @Post('subscribe')

    @ApiResponse({ status: 201, description: 'user subscribed in event' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async subscribeEvent(@Req() req: Request, @Body() event: EventSubscribeDto) {
        return await this.eventService.subscribe(req["user"]._id, event._id)
    }

    @Post('unsubscribe')


    @ApiResponse({ status: 201, description: 'user unsubscribed in event' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })


    async unsubcribeEvent(@Req() req: Request, @Body() event: EventSubscribeDto) {
        return await this.eventService.unsubscribe(req["user"]._id, event._id)
    }
    @Post('/approve')

    @ApiResponse({ status: 201, description: 'applicant approved in event' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })


    async approveInEvent(@Req() req: Request, @Body() data: EventApproveDto) {
        return await this.eventService.approve(req["user"]._id, data.user, data._id)
    }
    @Post('/send/invite')

    @ApiResponse({ status: 201, description: 'invitation sent to user' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async inviteEvent(@Req() req: Request, @Body() data: EventApproveDto) {

        return await this.eventService.toInvite(req["user"]._id, data.user, data._id)
    }
    @Post('/accept/invite')
    @ApiResponse({ status: 201, description: 'invitation accept' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 401, description: 'access token not found or invalid' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async inviteAccept(@Req() req: Request, @Body() data: EventResponseApproveDto) {

        return await this.eventService.respondToInvitation(req["user"]._id, data._id, data.accept)
    }
    @Get('me')
    @ApiResponse({ status: 200, description: 'my events' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })

    async getMyEvents(@Req() req: Request) {
        return await this.eventService.get(req["user"]._id, false)
    }

    @Get('all')
    @ApiResponse({ status: 200, description: 'all events' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })

    async getAllEvents(@Req() req: Request) {
        return await this.eventService.get(req["user"]._id, true)
    }

    @Get('/:id')
    @ApiResponse({ status: 200, description: 'return a event' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async getEvent(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.get(req["user"]._id, false, id)
    }

    @Get('/applicants/:id')

    @ApiResponse({ status: 200, description: 'return a event applicants' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async getApplicants(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.getApplicants(req["user"]._id, id)
    }

    @Get('/participants/:id')

    @ApiResponse({ status: 200, description: 'return a event participants' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async getParticipants(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.getParticipants(req["user"]._id, id)
    }

    @Get('/guests/:id')
    @ApiResponse({ status: 200, description: 'return a event guests' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async getGuests(@Req() req: Request, @Param('id') id: string) {
        return await this.eventService.getGuests(req["user"]._id, id)
    }

    @Get('/where/participate')
    @ApiResponse({ status: 200, description: 'return a events where i am participant' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    async getEventsWhereParticipant(@Req() req: Request) {
        return await this.eventService.getSubscribeOrApplicantsOrGuestEvents(req["user"]._id, "participant")
    }
    @Get('/where/applicate')
    @ApiResponse({ status: 200, description: 'return a events where i am applicant' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    async getEventsWhereApplicant(@Req() req: Request) {
        return await this.eventService.getSubscribeOrApplicantsOrGuestEvents(req["user"]._id, "applicant")
    }
    @Get('/where/guest')
    @ApiResponse({ status: 200, description: 'return a events where i am guest' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    async getEventsWhereGuest(@Req() req: Request) {
        return await this.eventService.getSubscribeOrApplicantsOrGuestEvents(req["user"]._id, "guest")
    }


    @Put('update/:id')
    @ApiResponse({ status: 200, description: 'event updated' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async updateEvent(@Req() req: Request, @Param('id') id: string, @Body() event: EventUpdateDto) {
        return await this.eventService.update(req["user"]._id, id, event)
    }

    @Put("update/background/:id")
    @UseInterceptors(FileInterceptor('file'))

    @ApiResponse({ status: 200, description: 'event background updated' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async updateProfile(@Req() req: Request, @Param('id') id: string, @UploadedFile(new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: 100000 }),
            new FileTypeValidator({ fileType: 'image' }),

        ],
    })) file: Express.Multer.File) {



        return await this.eventService.updateBackground(req["user"]._id, req["domain"], id, file.buffer)

    }

    @Delete('cancel/:id')

    @ApiResponse({ status: 200, description: 'event cancel' })
    @ApiResponse({ status: 500, description: 'internal error in application' })
    @ApiResponse({ status: 400, description: 'error in body of request' })
    @ApiResponse({ status: 404, description: 'event not found' })

    async cancelEvent(@Req() req: Request, @Param('id') id: string) {

        return await this.eventService.delete(req["user"]._id, id)
    }



}
