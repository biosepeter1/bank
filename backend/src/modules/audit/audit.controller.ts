import { Controller, Get, Query, UseGuards, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all audit logs (Super Admin only)' })
  getAllLogs(
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('actorRole') actorRole?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.getAllLogs({
      action,
      entity,
      actorRole,
      limit: limit ? parseInt(limit) : 100,
    });
  }

  @Get('stats')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get audit log statistics (Super Admin only)' })
  getStats() {
    return this.auditService.getStats();
  }

  @Delete('logs/:id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete audit log by ID (Super Admin only)' })
  deleteLog(@Param('id') logId: string) {
    return this.auditService.deleteAuditLog(logId);
  }

  @Delete('logs')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete multiple audit logs (Super Admin only)' })
  deleteLogs(@Body('ids') logIds: string[]) {
    return this.auditService.deleteAuditLogs(logIds);
  }
}
