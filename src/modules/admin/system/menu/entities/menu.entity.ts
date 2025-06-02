import { BaseEntity } from 'src/common/entities/base.entity';
import { MenuEnum, StatusEnum } from 'src/common/enums/common.enum';
import { Column, Entity, ManyToMany } from 'typeorm';
import { SysRoleEntity } from '../../role/entities/role.entity';

export
@Entity({ name: 'sys_menu' })
class SysMenuEntity extends BaseEntity {
  @Column({ type: 'enum', default: MenuEnum.DIR, enum: MenuEnum })
  type: number;

  @Column({
    name: 'icon',
    type: 'varchar',
    comment: '菜单图标',
    nullable: true,
  })
  icon: string;

  @Column({ name: 'sort', type: 'int', comment: '显示排序' })
  sort: string;

  @Column({ name: 'name', type: 'varchar', comment: '菜单名称' })
  name: string;

  @Column({
    name: 'is_link',
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.DISABLED,
    comment: '是否外链',
  })
  isLink: number;

  @Column({
    name: 'path',
    type: 'varchar',
    comment: '路由地址',
    nullable: true,
  })
  path: string;

  @Column({
    name: 'is_show',
    type: 'enum',
    enum: StatusEnum,
    comment: '显示状态',
    default: StatusEnum.ACTIVE,
  })
  isShow: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusEnum,
    comment: '状态',
    default: StatusEnum.ACTIVE,
  })
  status: number;

  @Column({ type: 'int', nullable: true, comment: '父级ID', default: null })
  parentId: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '权限标识',
    unique: true,
  })
  permission: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '组件路径' })
  component: string;

  @ManyToMany(() => SysRoleEntity, (role) => role.menus)
  roles: SysMenuEntity[];
}
