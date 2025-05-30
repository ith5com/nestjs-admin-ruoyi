import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { StaffEntity } from '../../staff/entities/staff.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '岗位名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, comment: '岗位描述' })
  description: string;

  @Column({ type: 'int', name: 'status', comment: '状态' })
  status: number;

  @Column({ type: 'int', name: 'sort', comment: '排序' })
  sort: number;

  @Column({ type: 'varchar', name: 'code', comment: '岗位编码' })
  code: string;

  @Column({ type: 'varchar', name: 'dept_id', comment: '部门ID' })
  deptId: string;

  @OneToMany(() => StaffEntity, (staff) => staff.post)
  staffs: StaffEntity[];
}
