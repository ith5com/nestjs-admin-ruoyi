import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateDeptDto, GetDeptListDto, UpdateDeptDto } from './dto/dept.dto';
import { DeptService } from './services/dept.service';

@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  async createDept(@Body() createDeptDto: CreateDeptDto) {
    return await this.deptService.createDept(createDeptDto);
  }

  @Put(':id')
  async updateDept(
    @Param('id') id: string,
    @Body() updateDeptDto: UpdateDeptDto,
  ) {
    return await this.deptService.updateDept(id, updateDeptDto);
  }

  @Delete(':id')
  async deleteDept(@Param('id') id: string) {
    return await this.deptService.deleteDept(id);
  }

  //   @Get(':id')
  //   async getDept(@Param('id') id: string) {
  //     return await this.deptService.getDept(id);
  //   }

  @Get()
  async getDeptList(@Query() query: GetDeptListDto) {
    return await this.deptService.getDeptList(query);
  }

  @Get('tree')
  async getDeptTree() {
    return await this.deptService.getDeptTree();
  }
}
