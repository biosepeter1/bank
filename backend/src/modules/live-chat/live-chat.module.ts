import { Module } from '@nestjs/common';
import { LiveChatGateway } from './live-chat.gateway';
import { LiveChatService } from './live-chat.service';
import { LiveChatController } from './live-chat.controller';

@Module({
    providers: [LiveChatGateway, LiveChatService],
    controllers: [LiveChatController],
    exports: [LiveChatService],
})
export class LiveChatModule { }
