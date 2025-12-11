import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { LoansService } from './loans.service';
import { CreateLoanApplicationDto, CreateGrantDto, ApproveLoanDto, RejectLoanDto } from './dto/create-loan-application.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('loans')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  /**
   * Apply for a loan
   */
  @Post('loans/apply')
  @ApiOperation({ summary: 'Apply for a loan' })
  async applyForLoan(
    @Request() req,
    @Body() data: CreateLoanApplicationDto,
  ) {
    return this.loansService.applyForLoan(req.user.id, data);
  }

  /**
   * Get all loan applications (user)
   */
  @Get('loans/applications')
  @ApiOperation({ summary: 'Get all loan applications' })
  async getLoanApplications(@Request() req) {
    return this.loansService.getLoanApplications(req.user.id);
  }

  /**
   * Get a specific loan application
   */
  @Get('loans/applications/:id')
  @ApiOperation({ summary: 'Get loan application details' })
  async getLoanApplication(
    @Request() req,
    @Param('id') loanId: string,
  ) {
    return this.loansService.getLoanApplication(req.user.id, loanId);
  }

  /** User responds to proposed offer */
  @Post('loans/applications/:id/respond')
  @ApiOperation({ summary: 'Respond to proposed loan offer' })
  async respondToOffer(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: { action: 'ACCEPT' | 'DECLINE' },
  ) {
    return this.loansService.userRespondToOffer(loanId, req.user.id, body.action);
  }

  /** User: delete own application if not ACTIVE */
  @Delete('loans/applications/:id')
  @ApiOperation({ summary: 'Delete a non-active loan application' })
  async deleteOwn(
    @Request() req,
    @Param('id') loanId: string,
  ) {
    return this.loansService.deleteLoanApplication(req.user.id, loanId);
  }

  /** Admin: list applications */
  @Get('loans/admin/applications')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'List loan applications (Admin only)' })
  async adminList(@Query('status') status?: string) {
    return this.loansService.adminListApplications(status);
  }

  /** Admin: propose revised offer */
  @Post('loans/admin/applications/:id/propose')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Propose a revised offer (Admin only)' })
  async propose(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: { amount: number; note?: string },
  ) {
    return this.loansService.proposeOffer(loanId, req.user.id, Number(body.amount || 0), body.note);
  }

  /** Admin: approve */
  @Post('loans/admin/applications/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve loan (Admin only)' })
  async approve(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: ApproveLoanDto,
  ) {
    return this.loansService.approveLoan(loanId, req.user.id, body);
  }

  /** Admin: reject */
  @Post('loans/admin/applications/:id/reject')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Reject loan (Admin only)' })
  async reject(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: RejectLoanDto,
  ) {
    return this.loansService.rejectLoan(loanId, req.user.id, body);
  }

  /** Admin: request processing fee */
  @Post('loans/admin/applications/:id/request-fee')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Request processing fee from user (Admin only)' })
  async requestFee(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: {
      processingFee: number;
      feeDescription: string;
      cryptoWalletAddress: string;
      cryptoType: string;
      approvalNote?: string;
    },
  ) {
    return this.loansService.requestProcessingFee(loanId, req.user.id, body);
  }

  /** User: submit fee payment proof */
  @Post('loans/applications/:id/submit-fee-proof')
  @ApiOperation({ summary: 'Submit processing fee payment proof' })
  async submitFeeProof(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: { proofUrl: string },
  ) {
    return this.loansService.submitFeePaymentProof(req.user.id, loanId, body.proofUrl);
  }

  /** Admin: verify payment and approve loan */
  @Post('loans/admin/applications/:id/verify-fee')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Verify fee payment and approve loan (Admin only)' })
  async verifyFee(
    @Request() req,
    @Param('id') loanId: string,
  ) {
    return this.loansService.verifyFeeAndApproveLoan(loanId, req.user.id);
  }

  /** Admin: disburse */
  @Post('loans/admin/applications/:id/disburse')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Disburse approved loan (Admin only)' })
  async disburse(
    @Request() req,
    @Param('id') loanId: string,
  ) {
    return this.loansService.disburseLoan(loanId, req.user.id);
  }

  /** Admin: update loan currency */
  @Post('loans/admin/applications/:id/update-currency')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update loan currency (Admin only)' })
  async updateCurrency(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: { currency: string },
  ) {
    return this.loansService.updateLoanCurrency(loanId, req.user.id, body.currency);
  }

  /** User: repay loan */
  @Post('loans/applications/:id/repay')
  @ApiOperation({ summary: 'Repay loan from wallet' })
  async repay(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: { amount: number },
  ) {
    return this.loansService.userRepayLoan(req.user.id, loanId, Number(body.amount || 0));
  }

  /** User: view loan repayment history */
  @Get('loans/applications/:id/repayments')
  @ApiOperation({ summary: 'Get loan repayment history' })
  async getRepayments(
    @Request() req,
    @Param('id') loanId: string,
  ) {
    return this.loansService.getRepayments(req.user.id, loanId);
  }

  /**
   * Request a grant
   */
  @Post('grants/apply')
  @ApiOperation({ summary: 'Apply for a grant' })
  async requestGrant(
    @Request() req,
    @Body() data: CreateGrantDto,
  ) {
    return this.loansService.requestGrant(req.user.id, data);
  }

  /**
   * Get all grants
   */
  @Get('grants/requests')
  @ApiOperation({ summary: 'Get all grant requests' })
  async getGrants(@Request() req) {
    return this.loansService.getGrants(req.user.id);
  }

  /**
   * Get a specific grant
   */
  @Get('grants/requests/:id')
  @ApiOperation({ summary: 'Get grant details' })
  async getGrant(
    @Request() req,
    @Param('id') grantId: string,
  ) {
    return this.loansService.getGrant(req.user.id, grantId);
  }
}
