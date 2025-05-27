import { Injectable } from '@nestjs/common';
import { CreateDeptDto, GetDeptListDto, UpdateDeptDto } from '../dto/dept.dto';
import { DeptRepositoryService } from './dept-repository.service';
import { DeptEntity } from '../entities/dept.entity';

@Injectable()
export class DeptService {
  constructor(private readonly deptRepositoryService: DeptRepositoryService) {}
  public async createDept(createDeptDto: CreateDeptDto) {
    return await this.deptRepositoryService.createDept(createDeptDto);
  }

  public async updateDept(id: string, updateDeptDto: UpdateDeptDto) {
    return await this.deptRepositoryService.updateDept(id, updateDeptDto);
  }

  public async deleteDept(id: string) {
    return await this.deptRepositoryService.deleteDept(id);
  }

  public async getDept(id: string) {
    return await this.deptRepositoryService.getDept(id);
  }

  public async getDeptList(query: GetDeptListDto) {
    return await this.deptRepositoryService.getDeptList(query);
  }

  public async getDeptTree() {
    const depts = await this.deptRepositoryService.getDeptTree();
    // 处理数据，移除敏感字段
    const processDept = (dept: DeptEntity) => {
      const { users, ...rest } = dept;
      if (dept['children']) {
        rest['children'] = dept['children'].map(processDept);
      }
      return rest;
    };
    return depts.map(processDept);
  }
}
