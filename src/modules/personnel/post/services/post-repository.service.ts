import { Injectable } from '@nestjs/common';
import { QueryPostDto } from '../dto/query-post.dto';
import { Repository } from 'typeorm';
import { PostEntity } from '../entitity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostRepositoryService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async findAll(query: QueryPostDto) {
    const { name, code, page, pageSize } = query;
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    if (name) {
      queryBuilder.where('post.name LIKE :name', { name: `%${name}%` });
    }
    if (code) {
      queryBuilder.where('post.code LIKE :code', { code: `%${code}%` });
    }
    queryBuilder.skip((query.page - 1) * query.pageSize).take(query.pageSize);
    const [data, total] = await queryBuilder.getManyAndCount();
    return {
      list: data,
      total,
      page,
      pageSize,
    };
  }
}
