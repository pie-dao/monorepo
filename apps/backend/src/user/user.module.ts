import { Module } from '@nestjs/common';
import { MongoUserRepository } from './repository';

@Module({
  imports: [],
  controllers: [],
  providers: [MongoUserRepository],
  exports: [MongoUserRepository],
})
export class UserModule {}
