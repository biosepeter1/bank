import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/prisma/prisma.service';
import { REQUIRE_EMAIL_VERIFIED_KEY } from '../decorators/email-verified.decorator';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireEmailVerified = this.reflector.getAllAndOverride<boolean>(REQUIRE_EMAIL_VERIFIED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireEmailVerified) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Fetch fresh user data to check email verification status
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { isEmailVerified: true },
    });

    if (!dbUser || !dbUser.isEmailVerified) {
      throw new ForbiddenException('Please verify your email address before performing this action');
    }

    return true;
  }
}
