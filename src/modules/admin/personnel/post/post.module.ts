import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entitity/post.entity';
import { PostRepositoryService } from './services/post-repository.service';
import { PostService } from './services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostService, PostRepositoryService],
})
export class PostModule {}
