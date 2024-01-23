import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from 'src/controllers/event/event.controller';
import { Event, eventSchema } from 'src/schemas/event.schema';
import { EventService } from 'src/services/event/event.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Event.name, schema: eventSchema }])],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService]

})
export class EventModule { }
