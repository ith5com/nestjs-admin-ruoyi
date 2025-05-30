import { Module } from '@nestjs/common';
import { StaffModule } from './staff/staff.module';
import { DeptModule } from './dept/dept.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './staff/entities/staff.entity';
import { DeptEntity } from './dept/entities/dept.entity';
import { RouterModule } from '@nestjs/core';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffEntity, DeptEntity]),
    StaffModule,
    DeptModule,
    PostModule,
    RouterModule.register([
      {
        path: 'personnel',
        module: PersonnelModule,
        children: [StaffModule, DeptModule, PostModule],
      },
    ]),
    PostModule,
  ],
})
export class PersonnelModule {}
