import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel, PostStatus } from '../generated/prisma/client';
import paginationHelper, { IOption } from 'src/helpers/paginationHelper';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // CREATE POST
  @Post()
  createPost(
    @Body()
    postData: Omit<PostModel, 'id' | 'createdAt' | 'updatedAt' | 'authorID'>,
  ) {
    const userID = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';
    return this.postService.createPost(postData, userID);
  }

  // GET ALL POSTS (with filters + pagination)
  @Get()
  getAllPosts(
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('status') status?: PostStatus,
    @Query('authorID') authorID?: string,
    @Query('isFeatures') isFeatures?: string,
    @Query() query?: IOption,
  ) {
    // tags: "tag1,tag2" → ["tag1", "tag2"]
    const tagsArray = tags ? tags.split(',') : [];

    // isFeatures: "true" | "false" → boolean | undefined
    const isFeaturesBool =
      isFeatures === 'true' ? true : isFeatures === 'false' ? false : undefined;

    const { page, limit, skip } = paginationHelper(query as IOption);

    return this.postService.getAllPosts({
      search,
      tags: tagsArray,
      status,
      authorID,
      isFeatures: isFeaturesBool,
      page,
      limit,
      skip,
    });
  }
  @Get('/:id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
}
