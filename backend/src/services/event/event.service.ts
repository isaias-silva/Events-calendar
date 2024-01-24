import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { writeFileSync } from 'fs';
import { Model } from 'mongoose';
import { resolve } from 'path';
import { EventCreateDto } from 'src/dtos/event.create.dto';
import { EventUpdateDto } from 'src/dtos/event.update.dto';
import { Responses } from 'src/enums/Responses';
import { Event } from 'src/schemas/event.schema';
import { UserService } from '../user/user.service';

@Injectable()

export class EventService {
    constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>,
        @Inject(UserService) private readonly userService: UserService) {
    }

    private async exists(filter): Promise<boolean> {
        try {
            if (!filter) {
                return false
            }
            const event = await this.eventModel.findOne(filter)

            return event ? true : false
        } catch (err) {
            Logger.error(err, 'Event Service')

        }
    }
    private async getCount(filter) {
        try {
            if (!filter) {
                return 0
            }
            const events = await this.eventModel.find(filter)

            return events.length
        } catch (err) {
            Logger.error(err, 'Event Service')

        }

    }
    async create(owner: string, event: EventCreateDto) {
        try {
            const { title, initString, endString, describ, isPrivate } = event

            const eventSameCount = await this.getCount({ title, owner })

            const formatTitle = eventSameCount > 0 ? title + `(${eventSameCount + 1})` : title

            const initDate = new Date(initString)
            const endDate = new Date(endString)

            await this.eventModel.create({ owner, title: formatTitle, describ, initDate, endDate, isPrivate })

            return {
                message: eventSameCount ? Responses.EVENT_CREATED_BUT_EVENT_NAME_EXISTS : Responses.EVENT_CREATED
            }
        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }
    async get(owner: string, isGlobal?: boolean, _id?: string) {
        try {
            if (_id) {
                const eventDb = await this.eventModel.findOne({ owner, _id })
                const { title, describ, initDate, endDate, background, isPrivate, participants, applicants } = eventDb
                const event = { title, describ, initDate, endDate, background, _id, owner, isPrivate, participants, applicants }
                return event

            } else {
                const eventsDb = await this.eventModel.find(isGlobal ? null : { owner })
                return eventsDb.map(eventDb => {
                    const { title, describ, initDate, endDate, background, participants, isPrivate, _id, owner } = eventDb
                    const event = { title, describ, initDate, endDate, background, _id, participants, isPrivate, owner }
                    return event
                })
            }

        } catch (err) {
            Logger.error(err, 'Event Service')
            throw err
        }
    }
    async update(owner: string, _id: string, event: EventUpdateDto) {
        try {
            const { title, initString, endString, describ } = event

            const eventExists = await this.exists({ _id, owner })

            if (!eventExists) {
                throw new NotFoundException(Responses.EVENT_NOT_FOUND)
            }


            const eventSameCount = await this.getCount({ title, owner })



            const updateObject: any = {};

            if (title) {
                updateObject.title = eventSameCount > 0 ? title + `(${eventSameCount + 1})` : title
            }

            if (describ) {
                updateObject.describ = describ;
            }

            if (endString) {
                updateObject.initDate = new Date(endString);
            }

            if (initString) {
                updateObject.endDate = new Date(initString);
            }
            if (describ) {
                updateObject.describ = describ

            }

            console.log(updateObject)

            await this.eventModel.updateOne({ owner, _id }, updateObject)


            return { message: eventSameCount > 0 ? Responses.EVENT_UPDATED_BUT_EVENT_NAME_EXISTS : Responses.EVENT_UPDATED }

        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }

    }

    async updateBackground(owner: string, domain: string, _id: string, file: Buffer) {
        try {
            const exist = await this.exists({ owner, _id })
            if (!exist) {
                throw new NotFoundException(Responses.EVENT_NOT_FOUND)
            }
            if (file) {
                const pathFile = resolve("public", "temp", _id + ".png")

                writeFileSync(pathFile, file)

                const background = domain + `/static/${_id}.png`
                await this.eventModel.updateOne({ _id }, { background })
                return { message: Responses.EVENT_BACKGROUND_ADDED }
            } else {
                throw new InternalServerErrorException(Responses.EVENT_INTERNAL_ERROR)
            }

        } catch (err) {
            Logger.error(err, 'Event Service')

        }
    }

    async delete(owner: string, _id: string) {
        try {
            const eventExists = await this.exists({ _id, owner })

            if (!eventExists) {
                throw new NotFoundException(Responses.EVENT_NOT_FOUND)
            }
            await this.eventModel.deleteOne({ _id })
            return { message: Responses.EVENT_DELETED }

        } catch (err) {
            Logger.error(err, 'User Service')
            throw err
        }
    }

    async subscribe(user: string, _id: string) {
        try {
            const eventDb = await this.eventModel.findOne({ _id })
            if (!eventDb) {
                throw new NotFoundException(Responses.EVENT_NOT_FOUND)
            }

            if (eventDb.owner == user) {
                throw new BadRequestException(Responses.YOU_ARE_OWNER_OF_EVENT)
            }

            const inParticipants = eventDb.participants.find(value => value == user)
            const inApplicants = eventDb.applicants.find(value => value == user)


            if (inParticipants) {
                throw new BadRequestException(Responses.USER_ALREADY_IN_PARTICIPANTS_GROUP)

            }
            if (inApplicants) {
                throw new BadRequestException(Responses.USER_ALREADY_IN_APPLICANTS_GROUP)

            }

            if (eventDb.isPrivate) {

                eventDb.applicants.push(user)
            } else {
                eventDb.participants.push(user)
            }

            await eventDb.save()

            return { message: Responses.YOU_SUBSCRIBE_IN_EVENT }




        } catch (err) {
            Logger.error(err, 'Event Service')
            throw err
        }
    }

    async approve(owner: string, user: string, _id: string) {
        try {
            const eventDb = await this.eventModel.findOne({ owner, _id })
            if (!eventDb) {
                throw new NotFoundException(Responses.EVENT_NOT_FOUND)
            }


            const inParticipants = eventDb.participants.find(value => value == user)
            const inApplicants = eventDb.applicants.find(value => value == user)


            if (!eventDb.isPrivate) {
                throw new BadRequestException(Responses.EVENT_IS_PUBLIC)
            }
            if (inParticipants) {
                throw new BadRequestException(Responses.USER_ALREADY_IN_PARTICIPANTS_GROUP)

            }
            if (!inApplicants) {
                throw new BadRequestException(Responses.USER_NOT_FOUND_IN_APPLICANTS_GROUP)

            }

            const indexOfUser = eventDb.applicants.indexOf(user)
            eventDb.applicants.splice(1, indexOfUser)
            eventDb.participants.push(user)
            await eventDb.save()

            return { message: Responses.YOU_APPROVE_THE_USER_IN_EVENT }

        } catch (err) {
            Logger.error(err, 'Event Service')
            throw err
        }

    }
}
