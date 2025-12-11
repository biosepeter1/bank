import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { EmailVerifiedGuard } from '@/common/guards/email-verified.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { RequireEmailVerified } from '@/common/decorators/email-verified.decorator';
import { TransfersService } from './transfers.service';
import { CreateTransferDto, CreateInternationalTransferDto, CreateBeneficiaryDto } from './dto/create-transfer.dto';
import { RequestTransferCodeDto, VerifyTransferCodeDto } from './dto/transfer-code-request.dto';
import { TransferCodeStatusResponseDto } from './dto/transfer-code-status.dto';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('transfers')
@ApiBearerAuth()
@Controller('transfers')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
export class TransfersController {
  constructor(private transfersService: TransfersService) { }

  /**
   * Initiate a local transfer between platform users
   */
  @Post('local')
  @RequireEmailVerified()
  @ApiOperation({ summary: 'Send money to another user' })
  async initiateLocalTransfer(
    @Request() req,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.transfersService.initiateLocalTransfer(req.user.id, createTransferDto);
  }

  /**
   * Request a local transfer (Pending; admin approval required)
   */
  @Post('request/local')
  @RequireEmailVerified()
  @ApiOperation({ summary: 'Request a local transfer (pending until admin approves)' })
  async requestLocalTransfer(
    @Request() req,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.transfersService.requestLocalTransfer(req.user.id, createTransferDto);
  }

  /**
   * Initiate an international transfer
   */
  @Post('international')
  @RequireEmailVerified()
  @ApiOperation({ summary: 'Send money internationally' })
  async initiateInternationalTransfer(
    @Request() req,
    @Body() data: CreateInternationalTransferDto,
  ) {
    return this.transfersService.initiateInternationalTransfer(req.user.id, data);
  }

  /**
   * Get all beneficiaries for the current user
   */
  @Get('beneficiaries')
  @ApiOperation({ summary: 'Get all saved beneficiaries' })
  async getBeneficiaries(@Request() req) {
    return this.transfersService.getBeneficiaries(req.user.id);
  }

  /**
   * Create a new beneficiary
   */
  @Post('beneficiaries')
  @ApiOperation({ summary: 'Add a new beneficiary' })
  async createBeneficiary(
    @Request() req,
    @Body() data: CreateBeneficiaryDto,
  ) {
    return this.transfersService.createBeneficiary(req.user.id, data);
  }

  /**
   * Update a beneficiary
   */
  @Patch('beneficiaries/:id')
  @ApiOperation({ summary: 'Update beneficiary details' })
  async updateBeneficiary(
    @Request() req,
    @Param('id') beneficiaryId: string,
    @Body() data: Partial<CreateBeneficiaryDto>,
  ) {
    return this.transfersService.updateBeneficiary(req.user.id, beneficiaryId, data);
  }

  /**
   * Delete a beneficiary
   */
  @Delete('beneficiaries/:id')
  @ApiOperation({ summary: 'Remove a beneficiary' })
  async deleteBeneficiary(
    @Request() req,
    @Param('id') beneficiaryId: string,
  ) {
    return this.transfersService.deleteBeneficiary(req.user.id, beneficiaryId);
  }

  /**
   * Set a beneficiary as default
   */
  @Patch('beneficiaries/:id/set-default')
  @ApiOperation({ summary: 'Set beneficiary as default' })
  async setDefaultBeneficiary(
    @Request() req,
    @Param('id') beneficiaryId: string,
  ) {
    return this.transfersService.setDefaultBeneficiary(req.user.id, beneficiaryId);
  }

  /**
   * Validate transfer codes
   */
  @Post('validate-codes')
  @ApiOperation({ summary: 'Validate transfer codes (COT, IMF, TAX)' })
  async validateCodes(
    @Request() req,
    @Body() { codes }: { codes: string[] },
  ) {
    const valid = await this.transfersService.validateTransferCodes(req.user.id, codes);
    return { valid };
  }

  // Stepwise transfer codes flow
  @Post('codes/request')
  @ApiOperation({ summary: 'Request a transfer code (COT/IMF/TAX)' })
  async requestCode(
    @Request() req,
    @Body() body: RequestTransferCodeDto,
  ) {
    return this.transfersService.requestTransferCode(req.user.id, body.type);
  }

  @Post('codes/verify')
  @ApiOperation({ summary: 'Verify a transfer code (COT/IMF/TAX)' })
  async verifyCode(
    @Request() req,
    @Body() body: VerifyTransferCodeDto,
  ) {
    return this.transfersService.verifyUserTransferCode(req.user.id, body.type, body.code);
  }

  @Get('codes/status')
  @ApiOperation({ summary: 'Get codes required flag and per-type status' })
  @ApiResponse({ type: TransferCodeStatusResponseDto })
  async getCodesStatus(@Request() req): Promise<TransferCodeStatusResponseDto> {
    return this.transfersService.getUserTransferCodeStatus(req.user.id);
  }

  /**
   * Get transfer history
   */
  @Get('history')
  @ApiOperation({ summary: 'Get user transfer history' })
  async getTransferHistory(
    @Request() req,
    @Query('limit') limit: string = '10',
    @Query('skip') skip: string = '0',
  ) {
    return this.transfersService.getTransferHistory(
      req.user.id,
      parseInt(limit),
      parseInt(skip),
    );
  }

  /**
   * Delete transfer (User can delete their own transfer history)
   */
  @Delete(':transferId')
  @ApiOperation({ summary: 'Delete transfer from history' })
  async deleteTransfer(
    @Request() req,
    @Param('transferId') transferId: string,
  ) {
    return this.transfersService.deleteTransfer(req.user.id, transferId);
  }

  /**
   * Admin: Get all transfers
   */
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all transfers (Admin only)' })
  async getAllTransfers() {
    return this.transfersService.getAllTransfers();
  }

  /**
   * Admin: Approve transfer
   */
  @Patch('admin/:transferId/approve')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve transfer (Admin only)' })
  async approveTransfer(
    @Param('transferId') transferId: string,
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.transfersService.approveTransfer(transferId, adminId);
  }

  /**
   * Admin: Reject transfer
   */
  @Patch('admin/:transferId/reject')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Reject transfer (Admin only)' })
  async rejectTransfer(
    @Param('transferId') transferId: string,
    @Body() body: { reason?: string },
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.transfersService.rejectTransfer(transferId, adminId, body.reason);
  }

  /**
   * Admin: Delete transfer
   */
  @Delete('admin/:transferId')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete transfer (Admin only)' })
  async adminDeleteTransfer(
    @Param('transferId') transferId: string,
    @Request() req,
  ) {
    const adminId = req.user.id;
    return this.transfersService.adminDeleteTransfer(transferId, adminId);
  }

  // Admin: Approve & issue transfer codes
  @Patch('codes/admin/:userId/:type/approve')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve and issue a transfer code to user (Admin only)' })
  async adminApproveCode(
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Request() req,
  ) {
    return this.transfersService.adminApproveAndIssueTransferCode(userId, type as any, req.user.id);
  }

  @Get('codes/admin/requests')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'List pending transfer code requests (Admin only)' })
  async adminListCodeRequests() {
    return this.transfersService.getPendingTransferCodeRequests();
  }

  @Get('codes/admin/:userId')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get a user\'s transfer codes and force flag (Admin only)' })
  async adminGetUserCodes(@Param('userId') userId: string) {
    return this.transfersService.adminGetUserCodes(userId);
  }

  @Patch('codes/admin/:userId/force')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Set per-user force verification flag (Admin only)' })
  async adminSetUserForce(
    @Param('userId') userId: string,
    @Body() body: { forced: boolean },
  ) {
    return this.transfersService.adminSetUserCodesForce(userId, !!body.forced);
  }
}
