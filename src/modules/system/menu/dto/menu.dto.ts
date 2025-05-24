import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { MenuEnum, StatusEnum } from 'src/common/enums/common.enum';

export class SysMenuDto {
  @ApiProperty({ description: '父级菜单id' })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '路由地址' })
  @IsString()
  @ValidateIf((o) => o.type !== MenuEnum.BUTTON)
  path: string;

  @ApiProperty({ description: '菜单图标' })
  @IsString()
  @ValidateIf((o) => o.type !== MenuEnum.BUTTON)
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: '菜单排序' })
  @IsNumber()
  @IsOptional()
  sort?: number = 0;

  @ApiProperty({ description: '菜单类型' })
  @IsEnum(MenuEnum)
  type: MenuEnum;

  @ApiProperty({ description: '菜单状态' })
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({ description: '是否显示' })
  @IsNumber()
  @IsOptional()
  isShow?: number = 1;

  @ApiProperty({ description: '是否外链' })
  @IsNumber()
  @IsOptional()
  @ValidateIf((o) => o.type !== MenuEnum.BUTTON)
  isLink?: number = 0;

  @ApiProperty({ description: '权限码' })
  @IsString()
  @IsOptional()
  permission?: string;

  @ApiProperty({ description: '组件路径' })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.type === MenuEnum.MENU)
  component?: string;
}

export class MenuUpdateDto extends PartialType(SysMenuDto) {}
