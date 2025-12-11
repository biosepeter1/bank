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
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove from userSockets
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; role: string },
  ) {
    this.userSockets.set(data.userId, client.id);
    console.log(`User ${data.userId} (${data.role}) registered with socket ${client.id}`);
    
    // Join user-specific room
    client.join(`user:${data.userId}`);
    
    // If admin, join admin room
    if (data.role === 'BANK_ADMIN' || data.role === 'SUPER_ADMIN') {
      client.join('admins');
    }
  }

  @SubscribeMessage('joinTicket')
  handleJoinTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ) {
    client.join(`ticket:${ticketId}`);
    console.log(`Client ${client.id} joined ticket ${ticketId}`);
  }

  @SubscribeMessage('leaveTicket')
  handleLeaveTicket(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ) {
    client.leave(`ticket:${ticketId}`);
    console.log(`Client ${client.id} left ticket ${ticketId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticketId: string; senderName: string },
  ) {
    // Broadcast typing indicator to all users in this ticket except sender
    client.to(`ticket:${data.ticketId}`).emit('userTyping', {
      ticketId: data.ticketId,
      senderName: data.senderName,
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() ticketId: string,
  ) {
    client.to(`ticket:${ticketId}`).emit('userStoppedTyping', { ticketId });
  }

  // Method to emit new message to all users in a ticket
  emitNewMessage(ticketId: string, message: any) {
    this.server.to(`ticket:${ticketId}`).emit('newMessage', message);
  }

  // Method to notify admins of new ticket
  notifyAdminsNewTicket(ticket: any) {
    this.server.to('admins').emit('newTicket', ticket);
  }

  // Method to notify user of ticket update
  notifyUserTicketUpdate(userId: string, ticket: any) {
    this.server.to(`user:${userId}`).emit('ticketUpdated', ticket);
  }
}
