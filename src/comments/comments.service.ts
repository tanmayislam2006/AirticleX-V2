import { Injectable } from '@nestjs/common';
import { CommentStatus } from 'src/generated/prisma/enums';
import { prisma } from 'src/libs/prisma';

@Injectable()
export class CommentsService {
  createComment = async (data: {
    content: string;
    authorID: string;
    postID: string;
    parentID?: string;
  }) => {
    await prisma.post.findFirstOrThrow({ where: { id: data.postID } });
    if (data.parentID) {
      await prisma.comment.findFirstOrThrow({ where: { id: data.parentID } });
    }
    const result = await prisma.comment.create({
      data,
    });
    return result;
  };
  getCommentById = async (id: string) => {
    return await prisma.comment.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            views: true,
          },
        },
      },
    });
  };
  getCommentsByAuthor = async (authorID: string) => {
    return await prisma.comment.findMany({
      where: {
        authorID,
      },
    });
  };
  updateComment = async (
    authorID: string,
    commentID: string,
    data: { content?: string; status?: CommentStatus },
  ) => {
    const isOwner = await prisma.comment.findFirst({
      where: {
        id: commentID,
        authorID,
      },
      select: {
        id: true,
        status: true,
      },
    });
    if (!isOwner) {
      throw new Error('Your provided input is invalid!');
    }
    if (isOwner.status === data.status) {
      throw new Error(`Your provided status ${data.status} is up to date`);
    }
    return await prisma.comment.update({
      where: {
        id: commentID,
        authorID,
      },
      data,
    });
  };
  moderateComment = async (
    commentID: string,
    data: { content?: string; status?: CommentStatus },
  ) => {
    const isOwner = await prisma.comment.findUniqueOrThrow({
      where: {
        id: commentID,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (isOwner.status === data.status) {
      throw new Error(`Your provided status ${data.status} is up to date`);
    }
    return await prisma.comment.update({
      where: {
        id: commentID,
      },
      data,
    });
  };
}
