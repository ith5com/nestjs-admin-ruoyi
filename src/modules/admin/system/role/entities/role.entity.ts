import { BaseEntity } from 'src/common/entities/base.entity';
import { StatusEnum } from 'src/common/enums/common.enum';
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';
import { SysUserEntity } from '../../user/entities/user.entity';
import { SysMenuEntity } from '../../menu/entities/menu.entity';

@Entity({ name: 'sys_roles' })
export class SysRoleEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    unique: true,
    nullable: false,
    comment: '角色名称',
  })
  name: string;

  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    nullable: false,
    comment: '角色编码',
  })
  code: string;

  @Column({ name: 'status', type: 'enum', default: 1, enum: StatusEnum })
  status: number;

  @Column({ name: 'remark', type: 'text', comment: '备注' })
  remark: string;

  @ManyToMany(() => SysUserEntity, (user) => user.roles)
  users: Relation<SysUserEntity[]>;

  @ManyToMany(() => SysMenuEntity, (menu) => menu.roles)
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'menu_id',
      referencedColumnName: 'id',
    },
  })
  menus: SysMenuEntity[];
}
