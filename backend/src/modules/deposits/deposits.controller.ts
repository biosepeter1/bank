import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DepositsService } from './deposits.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CreateDepositDto, ConfirmDepositDto, UploadDepositProofDto } from './dto/create-deposit.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Deposits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deposits')
export class DepositsController {
  constructor(private depositsService: DepositsService) {}

  /**
   * Initiate a new deposit
   */
  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate a new deposit' })
  async initiateDeposit(@Request() req, @Body() createDepositDto: CreateDepositDto) {
    const userId = req.user.id;
    return this.depositsService.initiateDeposit(userId, createDepositDto);
  }

  /**
   * Confirm a Paystack deposit
   */
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a Paystack deposit' })
  async confirmDeposit(@Request() req, @Body() confirmDepositDto: ConfirmDepositDto) {
    return this.depositsService.confirmPaystackDeposit(confirmDepositDto.reference);
  }

  /**
   * Get deposit history
   */
  @Get('history')
  @ApiOperation({ summary: 'Get user deposit history' })
  async getDepositHistory(
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.depositsService.getDepositHistory(userId);
  }

  /**
   * Get specific deposit details
   */
  @Get(':depositId')
  @ApiOperation({ summary: 'Get deposit details' })
  async getDepositById(
    @Request() req,
    @Param('depositId') depositId: string,
  ) {
    const userId = req.user.id;
    return this.depositsService.getDepositById(userId, depositId);
  }

  /**
   * Delete deposit (User can delete their own deposit history)
   */
  @Delete(':depositId')
  @ApiOperation({ summary: 'Delete deposit from history' })
  async deleteDeposit(
    @Request() req,
    @Param('depositId') depositId: string,
  ) {
    const userId = req.user.id;
    return this.depositsService.deleteDeposit(userId, depositId);
  }

  /**
   * Upload deposit proof for manual deposits
   */
  @Post(':depositId/upload-proof')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload deposit proof' })
  async uploadDepositProof(
    @Request() req,
    @Param('depositId') depositId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const userId = req.user.id;
    return this.depositsService.uploadDepositProof(userId, depositId, file);
  }

  /**
   * Admin: Get all deposits
   */
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all deposits (Admin only)' })
  async getAllDeposits() {
    return this.depositsService.getAllDeposits();
  }

  /**
   * Admin: Approve deposit
   */
  @Patch('admin/:depositId/approve')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve deposit (Admin only)' })
  async approveDeposit(
    @Param('depositId') depositId: string,
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.depositsService.approveDeposit(depositId, adminId);
  }

  /**
   * Admin: Reject deposit
   */
  @Patch('admin/:depositId/reject')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Reject deposit (Admin only)' })
  async rejectDeposit(
    @Param('depositId') depositId: string,
    @Body() body: { reason?: string },
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.depositsService.rejectDeposit(depositId, adminId, body.reason);
  }

  /**
   * Admin: Delete deposit
   */
  @Delete('admin/:depositId')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete deposit (Admin only)' })
  async adminDeleteDeposit(
    @Param('depositId') depositId: string,
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.depositsService.adminDeleteDeposit(depositId, adminId);
  }
}
