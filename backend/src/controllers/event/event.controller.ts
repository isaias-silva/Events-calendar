import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { EventCreateDto } from 'src/dtos/event.create.dto';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { MailGuard } from 'src/guards/mail/mail.guard';
import { EventService } from 'src/services/event/event.service';

@Controller('event')
@UseGuards(JwtGuard, MailGuard)

export class EventController {
    constructor(@Inject(EventService) private readonly eventService: EventService) { }
    @Post('create')
    async createEvent(@Req() req: Request, @Body() event: EventCreateDto) {
      
        return await this.eventService.createEvent(
            req["user"]._id,
            event.title,
            event.describ,
            event.initString,
            event.endString)
    }
}
