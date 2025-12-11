import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { getBanksByCountry, BANKS_BY_COUNTRY } from '../../common/data/banks';

@ApiTags('banks')
@Controller('banks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BanksController {
  @Get()
  @ApiOperation({ summary: 'Get all banks by country' })
  @ApiQuery({ name: 'country', required: false, description: 'Country code (e.g., NG, US, GB)' })
  getBanks(@Query('country') country?: string) {
    if (country) {
      return {
        country,
        banks: getBanksByCountry(country.toUpperCase()),
      };
    }
    
    return {
      countries: Object.keys(BANKS_BY_COUNTRY),
      banks: BANKS_BY_COUNTRY,
    };
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get supported countries' })
  getSupportedCountries() {
    return {
      countries: [
        { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
      ],
    };
  }
}
