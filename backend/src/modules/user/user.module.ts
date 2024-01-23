import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { UserController } from 'src/controllers/user/user.controller';
import { User, userSchema } from 'src/schemas/user.schema';
import { MailService } from 'src/services/mail/mail.service';
import { UserService } from 'src/services/user/user.service';
config()
@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    JwtModule.register({
        global: true,
        secret:process.env.SECRET ,
        signOptions: { expiresIn:'7d' },
      }),
],
    controllers: [UserController],
    providers: [UserService,MailService],
    exports: [UserService]
})
export class UserModule { }
