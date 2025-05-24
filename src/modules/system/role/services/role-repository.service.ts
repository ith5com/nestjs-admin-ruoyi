import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SysRoleEntity } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/role.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleRepositoryService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private readonly roleRepository: Repository<SysRoleEntity>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }
}
