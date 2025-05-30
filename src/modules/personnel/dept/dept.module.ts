import { Module } from '@nestjs/common';
import { DeptController } from './dept.controller';
import { DeptService } from './services/dept.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeptEntity } from './entities/dept.entity';
import { DeptRepositoryService } from './services/dept-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeptEntity])],
  controllers: [DeptController],
  providers: [DeptService, DeptRepositoryService],
  exports: [DeptService, DeptRepositoryService],
})
export class DeptModule {}
