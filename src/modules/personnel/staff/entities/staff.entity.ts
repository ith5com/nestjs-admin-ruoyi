import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { DeptEntity } from '../../dept/entities/dept.entity';
import { PostEntity } from '../../post/entitity/post.entity';

@Entity({ name: 'staff' })
export class StaffEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '姓名' })
  name: string;

  @Column({ type: 'varchar', name: 'job_number', length: 255, comment: '工号' })
  jobNumber: string;

  @Column({ type: 'varchar', length: 255, comment: '密码' })
  password: string;

  @Column({ type: 'varchar', length: 255, comment: '手机号' })
  phone: string;

  @Column({
    type: 'varchar',
    name: 'id_card',
    length: 255,
    comment: '身份证号',
  })
  idCard: string;

  @Column({ type: 'int', name: 'gender', comment: '性别' })
  gender: number;

  @Column({ type: 'date', name: 'birth_date', comment: '出生日期' })
  birthDate: Date;

  @Column({ type: 'date', name: 'entry_date', comment: '入职日期' })
  entryDate: Date;

  @Column({ type: 'date', name: 'leave_date', comment: '离职日期' })
  leaveDate: Date;

  @Column({ type: 'int', default: 1, comment: '状态' })
  status: number;

  @Column({ type: 'int', default: 0, comment: '剩余年假' })
  remainingAnnualLeave: number;

  @Column({
    type: 'date',
    name: 'contract_start_date',
    comment: '合同开始时间',
  })
  contractStartDate: Date;

  @Column({ type: 'date', name: 'contract_end_date', comment: '合同结束时间' })
  contractEndDate: Date;

  @ManyToOne(() => DeptEntity, (dept) => dept.staffs)
  @JoinColumn({ name: 'dept_id' })
  dept: Relation<DeptEntity>;

  @ManyToOne(() => PostEntity, (post) => post.staffs)
  @JoinColumn({ name: 'post_id' })
  post: Relation<PostEntity>;
}
