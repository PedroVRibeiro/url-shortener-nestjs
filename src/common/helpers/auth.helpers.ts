import { ForbiddenException } from '@nestjs/common';

export function assertIsSelfOrAdmin(
  user: { userId: string; role: string },
  targetId: string,
) {
  const isAdmin = user.role === 'ADMIN';
  const isSelf = user.userId === targetId;

  if (!isAdmin && !isSelf) {
    throw new ForbiddenException('You can not perform this action.');
  }
}
