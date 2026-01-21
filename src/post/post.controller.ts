import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  Post as PostModel,
  PostStatus,
  UserRole,
} from '../generated/prisma/client';
import paginationHelper, { IOption } from 'src/helpers/paginationHelper';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // CREATE POST
  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER)
  createPost(
    @Body()
    postData: Omit<PostModel, 'id' | 'createdAt' | 'updatedAt' | 'authorID'>,
    @User() user: any,
  ) {
    const userID = user.id;
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
  @Get('/my-posts')
  getMyPost(@Query() query?: IOption) {
    const { page, limit, skip } = paginationHelper(query as IOption);
    const id = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';

    return this.postService.getMyPost(id, page, limit, skip);
  }
  @Get('states')
  getAdminStates() {
    return this.postService.getAdminStates();
  }
  @Get('/:id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
  @Patch('/:id')
  updatePost(@Body() body: Record<string, any>, @Param('id') id: string) {
    const userid = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';
    const isAdmin = false;
    return this.postService.updatePost(id, userid, isAdmin, body);
  }
  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    const userid = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';
    const isAdmin = false;
    return this.postService.deletePost(id, userid, isAdmin);
  }
}
