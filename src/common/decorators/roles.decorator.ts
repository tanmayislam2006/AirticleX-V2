import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/generated/prisma/client';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
