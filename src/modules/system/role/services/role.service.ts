import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/role.dto';
import { RoleRepositoryService } from './role-repository.service';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepositoryService: RoleRepositoryService) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.roleRepositoryService.create(createRoleDto);
  }
}
