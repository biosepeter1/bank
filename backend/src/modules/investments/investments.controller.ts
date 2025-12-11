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
import { InvestmentsService } from './investments.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CreateInvestmentDto, LiquidateInvestmentDto } from './dto/create-investment.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Investments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  /**
   * Get available investment plans
   */
  @Get('plans')
  @ApiOperation({ summary: 'Get available investment plans' })
  getInvestmentPlans() {
    return this.investmentsService.getInvestmentPlans();
  }

  /**
   * Create a new investment
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new investment' })
  async createInvestment(
    @Request() req,
    @Body() createInvestmentDto: CreateInvestmentDto
  ) {
    const userId = req.user.id;
    return this.investmentsService.createInvestment(userId, createInvestmentDto);
  }

  /**
   * Get user investments
   */
  @Get('list')
  @ApiOperation({ summary: 'Get user investments' })
  async getUserInvestments(@Request() req) {
    const userId = req.user.id;
    return this.investmentsService.getUserInvestments(userId);
  }

  /**
   * Get investment summary
   */
  @Get('summary')
  @ApiOperation({ summary: 'Get investment summary with accrued interest' })
  async getInvestmentSummary(@Request() req) {
    const userId = req.user.id;
    return this.investmentsService.getInvestmentSummary(userId);
  }

  /**
   * Get specific investment details
   */
  @Get(':investmentId')
  @ApiOperation({ summary: 'Get investment details' })
  async getInvestmentById(
    @Request() req,
    @Param('investmentId') investmentId: string
  ) {
    const userId = req.user.id;
    return this.investmentsService.getInvestmentById(userId, investmentId);
  }

  /**
   * Liquidate investment early
   */
  @Post(':investmentId/liquidate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liquidate investment early (with penalty)' })
  async liquidateInvestment(
    @Request() req,
    @Param('investmentId') investmentId: string
  ) {
    const userId = req.user.id;
    return this.investmentsService.liquidateInvestment(userId, investmentId);
  }
}
