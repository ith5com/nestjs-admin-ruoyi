import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

import { StaffEntity } from '../../staff/entities/staff.entity';

@Entity('sys_dept')
export class DeptEntity extends BaseEntity {
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
    type: 'int',
    name: 'parent_id',
    nullable: true,
    default: 0,
    comment: '父级id',
  })
  parentId: number;

  @Column({
    type: 'int',
    name: 'order_num',
    default: 0,
    comment: '排序',
  })
  orderNum: number;

  @OneToMany(() => StaffEntity, (staff) => staff.dept)
  staffs: StaffEntity[];
}
