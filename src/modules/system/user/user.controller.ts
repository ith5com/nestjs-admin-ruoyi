import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { CreateUserDto, GetUserListDto, UpdateUserDto } from './dto/user.dto';
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

  /**
   * 更新用户信息
   * @param id 用户id
   * @param updateUserDto 更新用户信息
   * @returns 更新后的用户信息
   */
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  /**
   * 删除用户
   * @param id 用户id
   * @returns 删除后的用户信息
   */
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  /**
   * 获取用户详情
   * @param id 用户id
   * @returns 用户详情
   */
  @Get(':id')
  async getUserDetail(@Param('id') id: string) {
    return await this.userService.getUserDetail(id);
  }

  /**
   * 获取用户列表
   * @returns 用户列表
   */
  @Get()
  async getUserList(@Query() query: GetUserListDto) {
    return await this.userService.getUserList(query);
  }
}
