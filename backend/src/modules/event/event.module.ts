import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from 'src/controllers/event/event.controller';
import { Event, eventSchema } from 'src/schemas/event.schema';
import { EventService } from 'src/services/event/event.service';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/services/user/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Event.name, schema: eventSchema }]),
        UserModule],
    controllers: [EventController],
    providers: [EventService, UserService],
    exports: [EventService]

})
export class EventModule { }
