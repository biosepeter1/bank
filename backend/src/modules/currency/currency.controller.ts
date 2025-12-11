import { Controller, Get, Post, Body, Param, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

interface ConvertCurrencyDto {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  /**
   * Get exchange rate between two currencies
   */
  @Get('exchange-rate/:from/:to')
  @ApiOperation({ summary: 'Get exchange rate between currencies' })
  async getExchangeRate(
    @Param('from') from: string,
    @Param('to') to: string,
  ) {
    const rate = await this.currencyService.getExchangeRate(from, to);
    return { from, to, rate };
  }

  /**
   * Convert currency amount
   */
  @Post('convert')
  @ApiOperation({ summary: 'Convert amount from one currency to another' })
  async convertCurrency(@Body() data: ConvertCurrencyDto) {
    return this.currencyService.convertCurrency(
      data.amount,
      data.fromCurrency,
      data.toCurrency
    );
  }

  /**
   * Get supported currencies
   */
  @Get('supported')
  @ApiOperation({ summary: 'Get list of supported currencies' })
  async getSupportedCurrencies() {
    const currencies = await this.currencyService.getSupportedCurrencies();
    return { currencies };
  }

  /**
   * Get exchange rate history
   */
  @Get('history/:from/:to')
  @ApiOperation({ summary: 'Get exchange rate history' })
  async getExchangeRateHistory(
    @Param('from') from: string,
    @Param('to') to: string,
    @Query('days') days: number = 30,
  ) {
    const history = await this.currencyService.getExchangeRateHistory(from, to, days);
    return { from, to, days, history };
  }

  /**
   * Update exchange rate (admin only)
   */
  @Post('update-rate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update exchange rate (admin)' })
  async updateExchangeRate(
    @Body() data: { fromCurrency: string; toCurrency: string; rate: number }
  ) {
    return this.currencyService.updateExchangeRate(
      data.fromCurrency,
      data.toCurrency,
      data.rate
    );
  }
}
