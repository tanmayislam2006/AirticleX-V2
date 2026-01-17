import { Injectable } from '@nestjs/common';
import {
  CommentStatus,
  Post,
  PostStatus,
  UserStatus,
} from 'src/generated/prisma/client';
import { PostWhereInput } from 'src/generated/prisma/models';
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
  getAllPosts = async ({
    search,
    tags,
    status,
    authorID,
    isFeatures,
    page,
    limit,
    skip,
  }: {
    search: string | undefined;
    tags: string[] | [];
    status?: PostStatus | undefined;
    authorID: string | undefined;
    isFeatures: boolean | undefined;
    page: number;
    limit: number;
    skip: number;
  }) => {
    const searchCondition: PostWhereInput[] = [];
    if (search) {
      searchCondition.push({
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              has: search,
            },
          },
        ],
      });
    }

    if (tags.length > 0) {
      searchCondition.push({
        tags: {
          hasEvery: tags,
        },
      });
    }

    if (status) {
      searchCondition.push({
        status,
      });
    }

    if (authorID) {
      searchCondition.push({
        authorID,
      });
    }

    if (typeof isFeatures === 'boolean') {
      searchCondition.push({
        isFeatures,
      });
    }
    const result = await prisma.post.findMany({
      take: limit,
      skip: skip,
      where: {
        AND: searchCondition,
      },
    });
    const total = await prisma.post.count({
      where: {
        AND: searchCondition,
      },
    });
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };
  getPostById = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id },
        include: {
          comments: {
            where: {
              parentID: null,
            },
            orderBy: { createdAt: 'desc' },
            include: {
              replies: {
                where: {
                  status: CommentStatus.APPROVED,
                },
                orderBy: { createdAt: 'asc' },
                include: {
                  replies: {
                    where: {
                      status: CommentStatus.APPROVED,
                    },
                    orderBy: { createdAt: 'asc' },
                  },
                },
              },
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      });
      if (post) {
        await tx.post.update({
          where: { id },
          data: { views: { increment: 1 } },
        });
      }
      return post;
    });
  };
  getMyPost = async (id: string, page: number, limit: number, skip: number) => {
    await prisma.user.findUniqueOrThrow({
      where: {
        id,
        status: UserStatus.ACTIVE,
      },
    });
    const result = await prisma.post.findMany({
      take: limit,
      skip: skip,
      where: {
        authorID: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return result;
  };
}
