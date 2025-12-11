import { Controller, Get, Patch, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Req() req) {
    return this.notificationService.getUserNotifications(req.user.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const count = await this.notificationService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationService.markAsRead(id, req.user.userId);
  }

  @Post('mark-all-read')
  async markAllAsRead(@Req() req) {
    await this.notificationService.markAllAsRead(req.user.userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req) {
    await this.notificationService.deleteNotification(id, req.user.userId);
    return { message: 'Notification deleted successfully' };
  }

  @Post('delete-all')
  async deleteAllNotifications(@Req() req) {
    await this.notificationService.deleteAllNotifications(req.user.userId);
    return { message: 'All notifications deleted successfully' };
  }
}
