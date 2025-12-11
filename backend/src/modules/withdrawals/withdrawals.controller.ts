import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CreateWithdrawalDto, ApproveWithdrawalDto, RejectWithdrawalDto } from './dto/create-withdrawal.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Withdrawals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  /**
   * Initiate a withdrawal request
   */
  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate a withdrawal request' })
  async initiateWithdrawal(@Request() req, @Body() createWithdrawalDto: CreateWithdrawalDto) {
    const userId = req.user.id;
    return this.withdrawalsService.initiateWithdrawal(userId, createWithdrawalDto);
  }

  /**
   * Get withdrawal history
   */
  @Get('history')
  @ApiOperation({ summary: 'Get user withdrawal history' })
  async getWithdrawalHistory(@Request() req) {
    const userId = req.user.id;
    return this.withdrawalsService.getWithdrawalHistory(userId);
  }

  /**
   * Get specific withdrawal details
   */
  @Get(':withdrawalId')
  @ApiOperation({ summary: 'Get withdrawal details' })
  async getWithdrawalById(@Request() req, @Param('withdrawalId') withdrawalId: string) {
    const userId = req.user.id;
    return this.withdrawalsService.getWithdrawalById(userId, withdrawalId);
  }

  /**
   * Cancel a withdrawal request
   */
  @Post(':withdrawalId/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a pending withdrawal' })
  async cancelWithdrawal(@Request() req, @Param('withdrawalId') withdrawalId: string) {
    const userId = req.user.id;
    return this.withdrawalsService.cancelWithdrawal(userId, withdrawalId);
  }

  /**
   * Approve withdrawal (admin only)
   */
  @Post('admin/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve withdrawal (admin)' })
  async approveWithdrawal(@Body() data: ApproveWithdrawalDto) {
    return this.withdrawalsService.approveWithdrawal(data.withdrawalId);
  }

  /**
   * Reject withdrawal (admin only)
   */
  @Post('admin/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject withdrawal (admin)' })
  async rejectWithdrawal(@Body() data: RejectWithdrawalDto) {
    return this.withdrawalsService.rejectWithdrawal(data.withdrawalId, data.reason);
  }
}
