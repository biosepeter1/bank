import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark endpoints that suspended accounts can access
 * By default, suspended accounts are blocked from most actions
 * Use this decorator on endpoints that should be accessible to suspended accounts
 */
export const AllowSuspended = () => SetMetadata('allowSuspended', true);
