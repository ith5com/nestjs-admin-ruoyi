import { Injectable } from '@nestjs/common';
import { PostRepositoryService } from './post-repository.service';
import { QueryPostDto } from '../dto/query-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepositoryService: PostRepositoryService) {}
  public async findAll(query: QueryPostDto) {
    return this.postRepositoryService.findAll(query);
  }
}
