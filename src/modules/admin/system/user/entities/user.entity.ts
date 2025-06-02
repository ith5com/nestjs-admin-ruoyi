import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { StatusEnum } from 'src/common/enums/common.enum';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from 'typeorm';
import { SysRoleEntity } from '../../role/entities/role.entity';

@Entity({ name: 'sys_users' })
export class SysUserEntity extends BaseEntity {
  @Column({
    name: 'username',
    type: 'varchar',
    length: 10,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({ name: 'password', select: false, type: 'varchar', comment: '密码' })
  password: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 13,
    nullable: true,
    unique: true,
  })
  phone: string;

  @Column({ type: 'enum', name: 'status', default: 1, enum: StatusEnum })
  status: number;

  @ManyToMany(() => SysRoleEntity, (role) => role.users)
  @JoinTable({
    name: 'sys_user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Relation<SysRoleEntity[]>;
}
