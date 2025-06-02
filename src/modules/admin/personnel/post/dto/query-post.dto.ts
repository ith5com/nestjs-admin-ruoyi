import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from 'src/common/dto/query.dto';

export class QueryPostDto extends QueryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;
}
