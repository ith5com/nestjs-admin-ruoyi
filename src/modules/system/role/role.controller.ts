import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/role.dto';
import { RoleService } from './services/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async create(@Body() createUserDto: CreateRoleDto) {
    return await this.roleService.create(createUserDto);
  }
}
