import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateUserDto, UpdateUserDto, UpdateBalanceDto, UpdateKycStatusDto, AdminUpdateTransferCodeDto } from './dto/create-user.dto';
import { TransferCodeType } from '@prisma/client';
import { TransferCodeTypeEnum } from './dto/transfer-code.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BANK_ADMIN', 'SUPER_ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/volume')
  @ApiOperation({ summary: 'Get transaction volume data for last 7 days' })
  getTransactionVolume() {
    return this.adminService.getTransactionVolume();
  }

  @Get('dashboard/transaction-types')
  @ApiOperation({ summary: 'Get transaction type distribution' })
  getTransactionTypes() {
    return this.adminService.getTransactionTypeDistribution();
  }

  @Get('dashboard/recent-activities')
  @ApiOperation({ summary: 'Get recent system activities' })
  getRecentActivities() {
    return this.adminService.getRecentActivities();
  }

  @Get('dashboard/alerts')
  @ApiOperation({ summary: 'Get system alerts' })
  getSystemAlerts() {
    return this.adminService.getSystemAlerts();
  }

  @Get('sidebar-counts')
  @ApiOperation({ summary: 'Get pending counts for sidebar notifications' })
  getSidebarCounts() {
    return this.adminService.getSidebarCounts();
  }

  @Post('users/create')
  @ApiOperation({ summary: 'Create a new user account' })
  createUser(@Body() createUserDto: CreateUserDto, @CurrentUser() admin: any) {
    return this.adminService.createUser(createUserDto, admin.id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user details' })
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.updateUser(userId, updateUserDto, admin.id);
  }

  @Patch('users/:id/balance')
  @ApiOperation({ summary: 'Update user balance' })
  updateBalance(
    @Param('id') userId: string,
    @Body() updateBalanceDto: UpdateBalanceDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.updateUserBalance(userId, updateBalanceDto, admin.id);
  }

  @Patch('users/:id/kyc')
  @ApiOperation({ summary: 'Update KYC status' })
  updateKyc(
    @Param('id') userId: string,
    @Body() updateKycDto: UpdateKycStatusDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.updateKycStatus(userId, updateKycDto, admin.id);
  }

  @Get('users/:id/transfer-codes')
  @ApiOperation({ summary: 'Get user transfer codes' })
  getTransferCodes(@Param('id') userId: string) {
    return this.adminService.getTransferCodes(userId);
  }

  @Patch('users/:id/transfer-codes/:type')
  @ApiOperation({ summary: 'Update transfer code (COT, IMF, TAX)' })
  updateTransferCode(
    @Param('id') userId: string,
    @Param('type') codeType: string,
    @Body() updateCodeDto: AdminUpdateTransferCodeDto,
    @CurrentUser() admin: any,
  ) {
    return this.adminService.updateTransferCode(userId, codeType as TransferCodeType, updateCodeDto, admin.id);
  }
}
