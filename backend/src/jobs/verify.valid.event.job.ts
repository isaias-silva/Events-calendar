import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventDocument } from 'src/schemas/event.schema';
import { EventService } from 'src/services/event/event.service';


@Injectable()
export class VerifyValidEventJob {
    private readonly logger = new Logger(VerifyValidEventJob.name);

    constructor(private readonly eventService: EventService,
    ) {

    }
    @Cron('*/2 * * * *')

    async handleCron() {
        const events = await this.eventService.getAllDoc()

        events.forEach(async (event) => {
            await this.treatEvent(event)
        })

    }
    private async treatEvent(event: EventDocument) {
        try {
            if(event.usersNotify){
                return
            }
            this.logger.verbose(`check whether event "${event.title}" participants have already been notified`)
            const { initDate, endDate } = event
            const nowDate = new Date()

            if (nowDate > endDate) {

                await this.eventService.invalidateEvent(event.id)
            }

            if ((nowDate.getDay() == initDate.getDay())) {

                await this.eventService.sendNotify(event.id)
            }

        } catch (err) {
            this.logger.error(err)
        }
    }
}