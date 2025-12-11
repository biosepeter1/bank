import { Controller, Get, Param, Post, Body, UseGuards, Query } from '@nestjs/common';
import { LiveChatService } from './live-chat.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Live Chat')
@Controller('live-chat')
export class LiveChatController {
    constructor(private readonly liveChatService: LiveChatService) { }

    @Get('sessions')
    @ApiOperation({ summary: 'Get all chat sessions (Admin)' })
    async getSessions(@Query('status') status?: 'QUEUED' | 'ACTIVE' | 'ENDED') {
        return this.liveChatService.getSessions(status);
    }

    @Get('admin/sessions')
    @ApiOperation({ summary: 'Get all chat sessions for Admin Dashboard' })
    async getAdminSessions(@Query('status') status?: 'QUEUED' | 'ACTIVE' | 'ENDED') {
        return this.liveChatService.getSessions(status);
    }

    @Get('sessions/:id')
    @ApiOperation({ summary: 'Get a specific session with messages' })
    async getSession(@Param('id') id: string) {
        return this.liveChatService.getSession(id);
    }

    @Post('sessions/:id/end')
    @ApiOperation({ summary: 'End a chat session' })
    async endSession(@Param('id') id: string) {
        return this.liveChatService.endSession(id);
    }
}
