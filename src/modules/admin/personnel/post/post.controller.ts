import { Controller, Get, Query } from '@nestjs/common';
import { PostService } from './services/post.service';
import { QueryPostDto } from './dto/query-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 获取岗位列表
   * @param query 查询条件
   * @returns 岗位列表
   */
  @Get()
  findAll(@Query() query: QueryPostDto) {
    console.log(query);
    return this.postService.findAll(query);
  }
}
