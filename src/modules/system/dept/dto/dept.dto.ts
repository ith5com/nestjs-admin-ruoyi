import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeptDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  parentId: number;

  @IsNotEmpty()
  @IsNumber()
  orderNum: number;
}

export class UpdateDeptDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  orderNum: number;
}

export class GetDeptListDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}
