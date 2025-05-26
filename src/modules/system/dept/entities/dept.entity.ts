import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SysUserEntity } from '../../user/entities/user.entity';

@Entity('sys_dept')
export class DeptEntity extends BaseEntity{
  @Column({
    type: 'varchar',
    length: 255,
    comment: '部门名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: '部门编码',
  })
  code: string;

  @Column({
    type: 'varchar',
    name:'parent_id',
    nullable: true,
    comment: '父级id',
  })
  parentId: number;

  @Column({
    type: 'varchar',
    name:'order_num',
    default:0,
    comment: '排序',
  })
  orderNum: number;

  @OneToMany(()=>SysUserEntity,user=>user.dept)
  users: SysUserEntity[];
}