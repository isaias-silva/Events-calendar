import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'),
    UserModule,
    EventModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
