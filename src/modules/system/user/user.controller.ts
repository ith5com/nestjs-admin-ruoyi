import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtSystemGuardGuard } from 'src/common/guards/auth/jwt-system-auth.guard';

@ApiTags('系统用户')
@UseGuards(JwtSystemGuardGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: '创建系统用户' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
