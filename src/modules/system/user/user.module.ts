import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { BcryptProvider } from './services/bcrypt.provider';
import { SysUserRepositoryService } from './services/user-repository.service';
import { HashingProvider } from './services/hashing.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysUserEntity])],
  providers: [
    UserService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SysUserRepositoryService,
  ],
  controllers: [UserController],
})
export class UserModule {}
