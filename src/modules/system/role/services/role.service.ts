import { Injectable } from '@nestjs/common';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from '../dto/role.dto';
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
}
