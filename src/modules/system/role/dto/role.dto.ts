import { IsNotEmpty, IsOptional, Length } from 'class-validator';

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


export class UpdateRoleDto extends RoleDto {

}

export class GetRoleListDto  {
  @IsOptional()
  name: string;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}