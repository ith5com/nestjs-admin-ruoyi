import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { optional } from 'joi';

export class RoleDto {
  @Length(2, 10)
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  code: string;

  @IsOptional()
  remark: string;

  @IsNotEmpty()
  status: number;

  @IsOptional()
  menus: number[];
}

export class CreateRoleDto extends RoleDto {}

export class DeleteRoleDto {
  @IsNotEmpty()
  id: string;
}

export class UpdateRoleDto extends RoleDto {}

export class GetRoleListDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  code?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  pageSize?: number = 10;
}
