import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaUserRepository],
  exports: [UserService, PrismaUserRepository],
})
export class UserModule {}
