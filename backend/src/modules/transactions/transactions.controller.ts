import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  @ApiOperation({ summary: 'Get user transactions' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUserTransactions(
    @CurrentUser() user: any,
    @Query('limit') limit?: number,
  ) {
    return this.transactionsService.getUserTransactions(user.id, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get transaction statistics' })
  getStats(@CurrentUser() user: any) {
    return this.transactionsService.getTransactionStats(user.id);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Get global transaction statistics (Admin only)' })
  getAdminStats() {
    return this.transactionsService.getAdminTransactionStats();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'BANK_ADMIN')
  @ApiOperation({ summary: 'Get all transactions (Admin only)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAllTransactions(@Query('limit') limit?: number) {
    return this.transactionsService.getAllTransactions(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  getTransaction(@Param('id') id: string, @CurrentUser() user: any) {
    return this.transactionsService.getTransactionById(id, user.id);
  }
}
