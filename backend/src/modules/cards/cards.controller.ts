import { Controller, Get, Post, Delete, Param, UseGuards, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('cards')
@Controller('cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cards' })
  getUserCards(@CurrentUser() user: any) {
    return this.cardsService.getUserCards(user.id);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get user card requests' })
  getUserCardRequests(@CurrentUser() user: any) {
    return this.cardsService.getUserCardRequests(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get card by ID' })
  getCard(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.getCardById(id, user.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Request a new card' })
  createCard(
    @CurrentUser() user: any,
    @Body() body: { cardType?: 'VIRTUAL' | 'PHYSICAL'; reason?: string }
  ) {
    return this.cardsService.createVirtualCard(user.id, body.cardType, body.reason);
  }

  // User block/unblock actions
  @Post(':id/block')
  @ApiOperation({ summary: 'Block own card' })
  blockOwnCard(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.userBlockCard(id, user.id);
  }

  @Post(':id/unblock')
  @ApiOperation({ summary: 'Unblock own card' })
  unblockOwnCard(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.userUnblockCard(id, user.id);
  }

  @Get(':id/pan')
  @ApiOperation({ summary: 'Securely reveal full virtual card PAN (demo)' })
  getPan(@Param('id') id: string, @CurrentUser() user: any) {
    return this.cardsService.userGetPan(id, user.id);
  }

  // Admin endpoints
  @Get('admin/requests')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all card requests (Admin only)' })
  getAllCardRequests(@Query('status') status?: string) {
    return this.cardsService.getAllCardRequests(status);
  }

  @Post('admin/requests/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve card request (Admin only)' })
  approveCardRequest(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.cardsService.approveCardRequest(id, admin.id);
  }

  // User: Fund card from wallet balance
  @Post(':id/fund')
  @ApiOperation({ summary: 'Fund card from user wallet' })
  fundOwnCard(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { amount: number }
  ) {
    return this.cardsService.userFundCard(id, user.id, Number(body.amount || 0));
  }

  // User: Withdraw from card back to wallet
  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw funds from card back to wallet' })
  withdrawOwnCard(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { amount: number }
  ) {
    return this.cardsService.userWithdrawFromCard(id, user.id, Number(body.amount || 0));
  }

  @Post('admin/requests/:id/reject')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Reject card request (Admin only)' })
  rejectCardRequest(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Body() body: { reason: string }
  ) {
    return this.cardsService.rejectCardRequest(id, admin.id, body.reason);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all cards (Admin only)' })
  getAllCards() {
    return this.cardsService.getAllCards();
  }

  @Post('admin/:id/block')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Block a card (Admin only)' })
  blockCard(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.cardsService.blockCard(id, admin.id);
  }

  @Post('admin/:id/unblock')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Unblock a card (Admin only)' })
  unblockCard(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.cardsService.unblockCard(id, admin.id);
  }

  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('BANK_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete a card (Admin only)' })
  deleteCard(@Param('id') id: string, @CurrentUser() admin: any) {
    return this.cardsService.deleteCard(id, admin.id);
  }
}
