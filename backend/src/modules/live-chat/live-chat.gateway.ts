import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LiveChatService } from './live-chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'live-chat',
})
export class LiveChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly liveChatService: LiveChatService) { }

    async handleConnection(client: Socket) {
        // console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        // console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('startChat')
    async handleStartChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { userId?: string; name?: string; email?: string; userIp?: string },
    ) {
        const session = await this.liveChatService.createSession({
            socketId: client.id,
            userId: data.userId,
            userIp: data.userIp || client.handshake.address,
        });

        // Join room specifically for this session
        client.join(session.id);

        // Notify admins of new chat
        this.server.to('admin-room').emit('newChatSession', session);

        return { event: 'chatStarted', data: session };
    }

    @SubscribeMessage('joinAdminRoom')
    async handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
        // In a real app, verify admin role via Guard/Token
        client.join('admin-room');
        return { status: 'joined admin room' };
    }

    @SubscribeMessage('adminJoinSession')
    async handleAdminJoinSession(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { sessionId: string; adminId: string },
    ) {
        const session = await this.liveChatService.assignAdminToSession(data.sessionId, data.adminId);
        client.join(data.sessionId); // Admin joins the chat room

        // Notify user that admin joined
        this.server.to(data.sessionId).emit('adminJoined', { adminId: data.adminId });

        return session;
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { sessionId: string; message: string; sender: 'USER' | 'ADMIN' },
    ) {
        const savedMessage = await this.liveChatService.saveMessage(
            data.sessionId,
            data.message,
            data.sender,
        );

        // Broadcast to everyone in the room (User + Admin)
        this.server.to(data.sessionId).emit('newMessage', savedMessage);

        return savedMessage;
    }

    @SubscribeMessage('typing')
    async handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { sessionId: string; isTyping: boolean },
    ) {
        client.to(data.sessionId).emit('typingStatus', data);
    }

    @SubscribeMessage('adminEndSession')
    async handleAdminEndSession(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { sessionId: string; adminId: string },
    ) {
        // Update session status in database
        await this.liveChatService.endSession(data.sessionId);

        // Send a system message to the session
        const systemMessage = await this.liveChatService.saveMessage(
            data.sessionId,
            'This chat session has been ended by the support agent. Thank you for contacting us!',
            'SYSTEM',
        );

        // Broadcast the system message first
        this.server.to(data.sessionId).emit('newMessage', systemMessage);

        // Then notify everyone in the session that it has ended
        this.server.to(data.sessionId).emit('sessionEnded', data.sessionId);

        // Also notify admin room
        this.server.to('admin-room').emit('sessionEnded', data.sessionId);

        return { status: 'session ended', sessionId: data.sessionId };
    }
}
