import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: User[]

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    applicants: User[]

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    describ: string

    @Prop()
    background: string;


    @Prop({ required: true })
    init: Date


    @Prop({ required: true })
    end: Date

    @Prop({ default: false, require: true })
    isPrivate: boolean

}

export const eventSchema = SchemaFactory.createForClass(Event);