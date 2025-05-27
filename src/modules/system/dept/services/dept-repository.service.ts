import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeptEntity } from '../entities/dept.entity';
import { CreateDeptDto, GetDeptListDto, UpdateDeptDto } from '../dto/dept.dto';
import { ErrorResponseException } from 'src/common/exceptions/error-response.exception';
import { ErrorEnum } from 'src/common/enums/error.enum';

@Injectable()
export class DeptRepositoryService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepository: Repository<DeptEntity>,
  ) {}

  async createDept(createDeptDto: CreateDeptDto) {
    const dept = this.deptRepository.create(createDeptDto);
    return await this.deptRepository.save(dept);
  }

  async updateDept(id: string, updateDeptDto: UpdateDeptDto) {
    const dept = await this.deptRepository.findOneBy({ id: Number(id) });
    if (!dept) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_DEPT_NOT_FOUND);
    }
    Object.assign(dept, updateDeptDto);
    return await this.deptRepository.save(dept);
  }

  async deleteDept(id: string) {
    const dept = await this.deptRepository.findOneBy({ id: Number(id) });
    if (!dept) {
      throw new ErrorResponseException(ErrorEnum.SYSTEM_DEPT_NOT_FOUND);
    }
    await this.deptRepository.remove(dept);
  }

  async getDept(id: string) {
    return await this.deptRepository
      .createQueryBuilder('dept')
      .leftJoinAndSelect('dept.users', 'user')
      .where('dept.id = :id', { id: Number(id) })
      .getOne();
  }

  async getDeptList(query: GetDeptListDto) {
    const { name, code, parentId, page, pageSize } = query;
    const queryBuilder = this.deptRepository.createQueryBuilder('dept');
    if (name) {
      queryBuilder.andWhere('dept.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.andWhere('dept.code LIKE :code', { code: `%${code}%` });
    }
    if (parentId) {
      queryBuilder.andWhere('dept.parentId = :parentId', {
        parentId: parentId,
      });
    }
    queryBuilder.orderBy('dept.orderNum', 'ASC');
    const skip = (page - 1) * pageSize;
    const [depts, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
    return {
      data: depts,
      total: total,
      page: page,
      pageSize: pageSize,
    };
  }

  async findDeptById(id: number) {
    return await this.deptRepository
      .createQueryBuilder('dept')
      .where('dept.id = :id', { id: Number(id) })
      .getOne();
  }

  async getDeptTree() {
    // 1. 获取所有部门
    const depts = await this.deptRepository
      .createQueryBuilder('dept')
      .orderBy('dept.orderNum', 'ASC')
      .getMany();

    // 2. 构建树形结构
    const buildTree = (
      items: DeptEntity[],
      parentId: number = 0,
    ): DeptEntity[] => {
      const result: DeptEntity[] = [];
      for (const item of items) {
        if (item.parentId === parentId) {
          const children = buildTree(items, Number(item.id));
          if (children.length) {
            item['children'] = children;
          }
          result.push(item);
        }
      }
      return result;
    };

    return buildTree(depts);
  }
}
