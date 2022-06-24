import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ConsoleModule } from 'nestjs-console';
import * as path from 'path';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationModule } from './authorization/authorization.module';
import { FundsModule } from './fund';
import { PiesModule } from './pies/pies.module';
import { SentimentModule } from './sentiment/sentiment.module';
import { StakingModule } from './staking/staking.module';
import { TasksModule } from './tasks/tasks.module';
import { TreasuryModule } from './treasury/treasury.module';

@Module({
  imports: [
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
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: true,
      environment: process.env.NODE_ENV,
      release: '0.0.1',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(
        process.cwd(),
        'libs/util-graphql/src/graphql-schemas/schema.graphql',
      ),
      sortSchema: true,
      installSubscriptionHandlers: true,
      playground: true,
      debug: process.env.NODE_ENV === 'development',
      include: [FundsModule],
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    FundsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
