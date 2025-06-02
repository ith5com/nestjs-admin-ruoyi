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
import {
  CreateRoleDto,
  DeleteRoleDto,
  GetRoleListDto,
  UpdateRoleDto,
} from './dto/role.dto';
import { RoleService } from './services/role.service';
import { Permission } from 'src/common/decorators/permission.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  /**
   * 创建角色
   * @param createUserDto 创建角色dto
   * @returns 创建后的角色
   */
  @Post()
  @Permission('system:role:create')
  async create(@Body() createUserDto: CreateRoleDto) {
    return await this.roleService.create(createUserDto);
  }

  /**
   * 删除角色
   * @param deleteRoleDto 删除角色dto
   * @returns 删除后的角色
   */
  @Delete(':id')
  @Permission('system:role:del')
  async delete(@Param() deleteRoleDto: DeleteRoleDto) {
    return await this.roleService.delete(deleteRoleDto);
  }

  /**
   * 更新角色
   * @param updateRoleDto 更新角色dto
   * @returns 更新后的角色
   */
  @Put(':id')
  @Permission('system:role:update')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.roleService.update(id, updateRoleDto);
  }

  /**
   * 获取角色列表
   * @param query 查询条件
   * @returns 角色列表
   */
  @Get()
  @Permission('system:role:list')
  async getList(@Query() query: GetRoleListDto) {
    return await this.roleService.getList(query);
  }

  /**
   * 获取角色详情
   * @param id 角色id
   * @returns 角色详情
   */
  // @Get(':id')
  // async getDetail(@Param('id') id: string) {
  //   return await this.roleService.getDetail(id);
  // }

  @Get('options')
  async getOptions() {
    return await this.roleService.getOptions();
  }
}
