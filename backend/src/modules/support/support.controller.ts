import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { SupportService } from './support.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/create-ticket.dto';
import { ContactFormDto } from './dto/contact-form.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('support')
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) { }

  /**
   * Public: Submit a contact form (no auth required)
   */
  @Post('contact')
  @ApiOperation({ summary: 'Submit a contact form (public, no auth required)' })
  async submitContactForm(@Body() data: ContactFormDto) {
    return this.supportService.createGuestTicket(data);
  }

  /**
   * User: Create a support ticket
   */
  @ApiBearerAuth()
  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a support ticket' })
  async createTicket(@Request() req, @Body() data: CreateTicketDto) {
    return this.supportService.createTicket(req.user.id, data);
  }

  /**
   * User: Get all own tickets
   */
  @ApiBearerAuth()
  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all user support tickets' })
  async getUserTickets(@Request() req) {
    return this.supportService.getUserTickets(req.user.id);
  }

  /**
   * User: Get specific ticket
   */
  @ApiBearerAuth()
  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific support ticket' })
  async getTicket(@Request() req, @Param('id') ticketId: string) {
    return this.supportService.getTicket(req.user.id, ticketId);
  }

  /**
   * Admin: Get all tickets
   */
  @ApiBearerAuth()
  @Get('admin/tickets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all support tickets (Admin only)' })
  async getAllTickets(@Query('status') status?: string) {
    return this.supportService.getAllTickets(status);
  }

  /**
   * Admin: Get a specific ticket
   */
  @ApiBearerAuth()
  @Get('admin/tickets/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get a specific support ticket (Admin only)' })
  async getAdminTicket(@Param('id') ticketId: string) {
    return this.supportService.getAdminTicket(ticketId);
  }

  /**
   * Admin: Update ticket status
   */
  @ApiBearerAuth()
  @Patch('admin/tickets/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update support ticket (Admin only)' })
  async updateTicket(
    @Request() req,
    @Param('id') ticketId: string,
    @Body() data: UpdateTicketDto,
  ) {
    return this.supportService.updateTicket(ticketId, req.user.id, data);
  }

  /**
   * Admin: Delete ticket
   */
  @ApiBearerAuth()
  @Delete('admin/tickets/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete support ticket (Admin only)' })
  async deleteTicket(@Request() req, @Param('id') ticketId: string) {
    return this.supportService.deleteTicket(ticketId, req.user.id);
  }

  /**
   * User: Add reply to ticket
   */
  @ApiBearerAuth()
  @Post('tickets/:id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a reply to support ticket' })
  async addUserReply(
    @Request() req,
    @Param('id') ticketId: string,
    @Body() body: { message: string },
  ) {
    return this.supportService.addUserReply(req.user.id, ticketId, body.message);
  }

  /**
   * Admin: Add reply to ticket
   */
  @ApiBearerAuth()
  @Post('admin/tickets/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Add admin reply to support ticket (Admin only)' })
  async addAdminReply(
    @Request() req,
    @Param('id') ticketId: string,
    @Body() body: { message: string },
  ) {
    return this.supportService.addAdminReply(req.user.id, ticketId, body.message);
  }

  /**
   * Admin: Send email reply to guest
   */
  @ApiBearerAuth()
  @Post('admin/tickets/:id/email-reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Send email reply to guest contact (Admin only)' })
  async sendGuestEmailReply(
    @Request() req,
    @Param('id') ticketId: string,
    @Body() body: { guestEmail: string; guestName: string; subject: string; message: string },
  ) {
    return this.supportService.sendGuestEmailReply(ticketId, body, req.user);
  }
}

