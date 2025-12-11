import { Controller, Get, Put, Body, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { EmailService } from '../../common/services/email.service';
import { AllowSuspended } from '../../common/decorators/allow-suspended.decorator';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService, private readonly email: EmailService) { }

  @Get()
  @AllowSuspended()
  @ApiOperation({ summary: 'Get all system settings - Public endpoint' })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system settings - Admin only' })
  updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(updateSettingsDto);
  }

  @Post('test-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a test email using current SMTP settings' })
  async testEmail(@Body('to') to: string) {
    const settings = await this.settingsService.getSettings();
    const dest = to || settings.general.supportEmail;
    await this.email.sendGenericNotification({
      email: dest,
      title: 'Test Email',
      message: 'If you received this, SMTP is configured correctly.',
    });
    return { success: true, to: dest };
  }
}
