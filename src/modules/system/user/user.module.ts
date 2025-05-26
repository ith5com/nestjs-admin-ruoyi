import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { BcryptProvider } from './services/bcrypt.provider';
import { SysUserRepositoryService } from './services/user-repository.service';
import { HashingProvider } from './services/hashing.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysUserEntity } from './entities/user.entity';
import { RoleModule } from '../role/role.module';
import { DeptModule } from '../dept/dept.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SysUserEntity]),
    forwardRef(() => RoleModule),
    forwardRef(() => DeptModule),
  ],
  providers: [
    UserService,
    SysUserRepositoryService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  controllers: [UserController],
  exports: [UserService, SysUserRepositoryService, HashingProvider],
})
export class UserModule {}
