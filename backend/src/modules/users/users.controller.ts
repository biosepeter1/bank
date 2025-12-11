import { Controller, Get, Param, Patch, Body, UseGuards, Delete, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AccountStatus } from '@prisma/client';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  findAll(@CurrentUser() admin: any) {
    return this.usersService.findAll(admin.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Update user account status (Admin only)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: AccountStatus,
  ) {
    return this.usersService.updateUserStatus(id, status);
  }

  @Post(':id/balance')
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Adjust user balance (Admin only)' })
  adjustBalance(
    @Param('id') id: string,
    @Body() data: { type: 'credit' | 'debit'; amount: number; reason?: string },
    @CurrentUser() admin: any,
  ) {
    return this.usersService.adjustBalance(id, data.type, data.amount, data.reason, admin.id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
