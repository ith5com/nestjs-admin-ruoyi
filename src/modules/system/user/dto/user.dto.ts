import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @Matches(/^[\s\S]+$/)
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @ApiProperty({ description: '密码' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  password: string;

  @IsOptional()
  phone: string;

  @IsIn([0, 1])
  @IsOptional()
  status?: number;
}

export class CreateUserDto extends UserDto {
  @IsOptional()
  roles: number[]|null;


  @IsOptional()
  deptId: number;
}


export class UpdateUserDto  {
  @IsString()
  @Matches(/^[\s\S]+$/)
  @MinLength(4)
  @MaxLength(10)
  username: string;

  @IsOptional()
  phone: string;

  @IsIn([0, 1])
  @IsOptional()
  status?: number;

  @IsNotEmpty()
  roles: number[]|null;

  @IsOptional()
  deptId: number;
}

export class GetUserListDto {

  @IsOptional()
  username: string;

  @IsOptional()
  phone: string;

  @IsIn([0, 1])
  @IsOptional()
  status?: number;

  @IsOptional()
  page: number;

  @IsOptional()
  pageSize: number;
}