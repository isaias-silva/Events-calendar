import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: string[]

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    applicants: string[]

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    describ: string

    @Prop()
    background: string;


    @Prop({ required: true })
    initDate: Date


    @Prop({ required: true })
    endDate: Date

    @Prop({ default: false, require: true })
    isPrivate: boolean

    @Prop({ default: true, require: true })
    isActive: boolean



}

export const eventSchema = SchemaFactory.createForClass(Event);