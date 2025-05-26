import { Injectable } from '@nestjs/common';
import { CreateDeptDto, GetDeptListDto, UpdateDeptDto } from '../dto/dept.dto';
import { DeptRepositoryService } from './dept-repository.service';

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
}
