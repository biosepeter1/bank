"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportGateway", {
    enumerable: true,
    get: function() {
        return SupportGateway;
    }
});
const _websockets = require("@nestjs/websockets");
const _socketio = require("socket.io");
const _prismaservice = require("../../prisma/prisma.service");
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let SupportGateway = class SupportGateway {
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        // Remove from userSockets
        for (const [userId, socketId] of this.userSockets.entries()){
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                break;
            }
        }
    }
    handleRegister(client, data) {
        this.userSockets.set(data.userId, client.id);
        console.log(`User ${data.userId} (${data.role}) registered with socket ${client.id}`);
        // Join user-specific room
        client.join(`user:${data.userId}`);
        // If admin, join admin room
        if (data.role === 'BANK_ADMIN' || data.role === 'SUPER_ADMIN') {
            client.join('admins');
        }
    }
    handleJoinTicket(client, ticketId) {
        client.join(`ticket:${ticketId}`);
        console.log(`Client ${client.id} joined ticket ${ticketId}`);
    }
    handleLeaveTicket(client, ticketId) {
        client.leave(`ticket:${ticketId}`);
        console.log(`Client ${client.id} left ticket ${ticketId}`);
    }
    handleTyping(client, data) {
        // Broadcast typing indicator to all users in this ticket except sender
        client.to(`ticket:${data.ticketId}`).emit('userTyping', {
            ticketId: data.ticketId,
            senderName: data.senderName
        });
    }
    handleStopTyping(client, ticketId) {
        client.to(`ticket:${ticketId}`).emit('userStoppedTyping', {
            ticketId
        });
    }
    // Method to emit new message to all users in a ticket
    emitNewMessage(ticketId, message) {
        this.server.to(`ticket:${ticketId}`).emit('newMessage', message);
    }
    // Method to notify admins of new ticket
    notifyAdminsNewTicket(ticket) {
        this.server.to('admins').emit('newTicket', ticket);
    }
    // Method to notify user of ticket update
    notifyUserTicketUpdate(userId, ticket) {
        this.server.to(`user:${userId}`).emit('ticketUpdated', ticket);
    }
    constructor(prisma){
        this.prisma = prisma;
        this.userSockets = new Map(); // userId -> socketId
    }
};
_ts_decorate([
    (0, _websockets.WebSocketServer)(),
    _ts_metadata("design:type", typeof _socketio.Server === "undefined" ? Object : _socketio.Server)
], SupportGateway.prototype, "server", void 0);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('register'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportGateway.prototype, "handleRegister", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('joinTicket'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportGateway.prototype, "handleJoinTicket", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('leaveTicket'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportGateway.prototype, "handleLeaveTicket", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('typing'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportGateway.prototype, "handleTyping", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('stopTyping'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SupportGateway.prototype, "handleStopTyping", null);
SupportGateway = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _websockets.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true
        }
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], SupportGateway);

//# sourceMappingURL=support.gateway.js.map