import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    mail: string

    @Prop({ required: true })
    password: string;

    @Prop({ default: false, required: true })
    mailVerify: boolean;

    @Prop()
    profile: string

}

export const userSchema = SchemaFactory.createForClass(User);