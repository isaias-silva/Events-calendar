import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'),
  MulterModule.register({
    dest: '/upload',
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public','temp'),
    serveRoot: '/static',
  }),
    UserModule,
    EventModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
