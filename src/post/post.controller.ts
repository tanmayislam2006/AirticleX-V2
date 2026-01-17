import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from 'src/generated/prisma/client';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  createPost(
    @Body()
    postData: Omit<PostModel, 'id' | 'createdAt' | 'updatedAt' | 'authorID'>,
  ) {
    const userID = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';
    return this.postService.createPost(postData, userID);
  }
}
