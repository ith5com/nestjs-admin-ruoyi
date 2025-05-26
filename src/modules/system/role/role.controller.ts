import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateRoleDto, DeleteRoleDto } from './dto/role.dto';
import { RoleService } from './services/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async create(@Body() createUserDto: CreateRoleDto) {
    return await this.roleService.create(createUserDto);
  }

  @Delete(':id')
  async delete(@Param() deleteRoleDto: DeleteRoleDto) {
    return await this.roleService.delete(deleteRoleDto);
  }
}
