import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PiesModule } from './pies/pies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { StakingModule } from './staking/staking.module';
import { TreasuryModule } from './treasury/treasury.module';
import { TasksModule } from './tasks/tasks.module';
import { ConsoleModule } from 'nestjs-console';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SentimentModule } from './sentiment/sentiment.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [
    BotModule,
    PiesModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/pies*', '/staking*'],
      serveRoot: '/public/',
    }),
    StakingModule,
    TreasuryModule,
    TasksModule,
    ConsoleModule,
    SentimentModule,
    AuthorizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
