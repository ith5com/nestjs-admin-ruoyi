import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  page: number = 1;

  @IsOptional()
  pageSize: number = 10;
}
