import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentStatus } from 'src/generated/prisma/enums';

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
  @Get('/author/:authorID')
  getCommentsByAuthor(@Param('authorID') authorID: string) {
    return this.commentService.getCommentsByAuthor(authorID);
  }
  @Patch('/:commentID')
  updateComment(
    @Param() commentID: string,
    @Body()
    data: {
      content?: string;
      status?: CommentStatus;
    },
  ) {
    const userID: string = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';
    return this.commentService.updateComment(userID, commentID, data);
  }
  @Patch('/:commentID/moderate')
  moderateComment(
    @Param() commentID: string,
    @Body() data: { content?: string; status?: CommentStatus },
  ) {
    return this.commentService.moderateComment(commentID, data);
  }
  @Delete('/:commentID')
  deleteComment(@Param() commentID: string) {
    const userID: string = 'JuY5S9WEPWr19EHXTennC7LvbBt9ORN8';
    return this.commentService.deleteComment(userID, commentID);
  }
}
