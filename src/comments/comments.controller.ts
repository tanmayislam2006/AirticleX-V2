import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post()
  createComment(
    @Body()
    data: {
      content: string;
      authorID: string;
      postID: string;
      parentID?: string;
    },
  ) {
    return this.commentService.createComment(data);
  }
  @Get('/:commentID')
  getCommentById(@Param('commentID') commentID: string) {
    return this.commentService.getCommentById(commentID);
  }
}
