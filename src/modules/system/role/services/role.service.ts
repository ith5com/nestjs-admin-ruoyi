import { Injectable } from '@nestjs/common';
import { CreateRoleDto, DeleteRoleDto, GetRoleListDto, UpdateRoleDto } from '../dto/role.dto';
import { RoleRepositoryService } from './role-repository.service';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepositoryService: RoleRepositoryService) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepositoryService.create(createRoleDto);
  }

  async delete(deleteRoleDto: DeleteRoleDto) {
    return await this.roleRepositoryService.delete(deleteRoleDto);
  }

  /**
   * 更新角色
   * @param id 角色id
   * @param updateRoleDto 更新角色dto
   * @returns 更新后的角色
   */
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepositoryService.updateRole(id, updateRoleDto);
  }

  /**
   * 获取角色列表
   * @param query 查询条件
   * @returns 角色列表
   */
  async getList(query: GetRoleListDto) {
    return await this.roleRepositoryService.getRolesList(query);
  }

  /**
   * 获取角色详情
   * @param id 角色id
   * @returns 角色详情
   */
  async getDetail(id: string) {
    return await this.roleRepositoryService.getRoleDetail(id);
  }
}
