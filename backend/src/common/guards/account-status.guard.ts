import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Guard that checks if user's account status allows them to perform certain actions
 * Suspended accounts have very limited access - they can only:
 * - View their profile
 * - View account status
 * - Contact support
 * - Update profile (limited)
 */
@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if this endpoint allows suspended accounts
    const allowSuspended = this.reflector.get<boolean>(
      'allowSuspended',
      context.getHandler(),
    );

    // If explicitly allowed, skip check
    if (allowSuspended) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return true; // Let JWT guard handle authentication
    }

    // Fetch current user status from database
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { accountStatus: true },
    });

    if (!dbUser) {
      throw new ForbiddenException('User not found');
    }

    // Block suspended accounts from most actions
    if (dbUser.accountStatus === 'SUSPENDED') {
      throw new ForbiddenException(
        'Your account is suspended. You have limited access. Please contact support or check your account status.',
      );
    }

    // Block frozen accounts entirely
    if (dbUser.accountStatus === 'FROZEN') {
      throw new ForbiddenException(
        'Your account is frozen. Please contact support immediately.',
      );
    }

    // Block closed accounts
    if (dbUser.accountStatus === 'CLOSED') {
      throw new ForbiddenException(
        'Your account has been closed. Please contact support if you believe this is an error.',
      );
    }

    return true;
  }
}
