import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SysUserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class SysUserRepositoryService {
  constructor(
    @InjectRepository(SysUserEntity)
    private readonly sysUserRepository: Repository<SysUserEntity>,
  ) {}

  public async createUser({ username, password, phone }: CreateUserDto) {
    const user = this.sysUserRepository.create({
      username,
      password,
      phone,
    });
    return await this.sysUserRepository.save(user);
  }

  /**
   *
   * @param username
   * @returns
   * 通过用户名查找用户信息
   */
  public async findUserByUsername(username: string) {
    return await this.sysUserRepository.findOneBy({ username });
  }

  public async getUsersByRoleId(roleId: number): Promise<SysUserEntity[]> {
    return await this.sysUserRepository
      .createQueryBuilder('user')
      .innerJoin('user.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .getMany();
  }
}
