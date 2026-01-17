import { Injectable } from '@nestjs/common';
import { Post } from 'src/generated/prisma/client';
import { prisma } from 'src/libs/prisma';

@Injectable()
export class PostService {
  createPost = async (
    data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorID'>,
    userID: string,
  ) => {
    const result = await prisma.post.create({
      data: {
        ...data,
        authorID: userID,
      },
    });
    return result;
  };
}
