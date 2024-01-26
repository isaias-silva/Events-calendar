import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ExtractDomainMiddleware } from './middlewares/extractDomain.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { VerifyValidEventJob } from './jobs/verify.valid.event.job';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'),
  MulterModule.register({
    dest: '/upload',
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public', 'temp'),
    serveRoot: '/static',

  }),
  ScheduleModule.forRoot(),
    UserModule,
    EventModule
  ],
  controllers: [],
  providers: [VerifyValidEventJob],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractDomainMiddleware).forRoutes('*')
  }
}
