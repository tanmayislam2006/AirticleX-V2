import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { auth } from 'src/libs/auth';
import { UserRole } from 'src/generated/prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session || !session.user) {
        throw new UnauthorizedException({ message: 'Unauthorized' });
      }

      request['user'] = {
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role,
        emailVerified: session.user.emailVerified!,
      };

      if (!session.user.emailVerified) {
        throw new ForbiddenException({
          success: false,
          message: 'Email verification required. Please verify your email!',
        });
      }

      if (roles && roles.length > 0) {
        if (!roles.includes(session.user.role as UserRole)) {
          throw new ForbiddenException({
            success: false,
            message:
              "Forbidden You don't have permission to access this resources!",
          });
        }
      }

      return true;
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof ForbiddenException
      ) {
        throw err;
      }
      // If getSession fails or other errors
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
  }
}
