import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Responses } from 'src/enums/Responses';
import { Event } from 'src/schemas/event.schema';

@Injectable()
export class EventService {
    constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) {
    }

    async exists(filter): Promise<boolean> {
        try {
            if (!filter) {
                return false
            }
            const event = await this.eventModel.findOne(filter)

            return event ? true : false
        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async createEvent(owner: string, title: string, describ: string, initString: string, endString: string
    ) {
        try {
            const exists = await this.exists({ title, owner })

            if (exists) {
                throw new BadRequestException(Responses.EVENT_ALREADY_EXISTS)
            }
            const init = new Date(initString)
            const end = new Date(endString)
          
            await this.eventModel.create({ owner, title, describ, init, end })
            return {message:Responses.EVENT_CREATED}
        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
}
