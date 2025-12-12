"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LiveChatGateway", {
    enumerable: true,
    get: function() {
        return LiveChatGateway;
    }
});
const _websockets = require("@nestjs/websockets");
const _socketio = require("socket.io");
const _livechatservice = require("./live-chat.service");
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
let LiveChatGateway = class LiveChatGateway {
    async handleConnection(client) {
    // console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
    // console.log(`Client disconnected: ${client.id}`);
    }
    async handleStartChat(client, data) {
        const session = await this.liveChatService.createSession({
            socketId: client.id,
            userId: data.userId,
            userIp: data.userIp || client.handshake.address
        });
        // Join room specifically for this session
        client.join(session.id);
        // Notify admins of new chat
        this.server.to('admin-room').emit('newChatSession', session);
        return {
            event: 'chatStarted',
            data: session
        };
    }
    async handleJoinAdminRoom(client) {
        // In a real app, verify admin role via Guard/Token
        client.join('admin-room');
        return {
            status: 'joined admin room'
        };
    }
    async handleAdminJoinSession(client, data) {
        const session = await this.liveChatService.assignAdminToSession(data.sessionId, data.adminId);
        client.join(data.sessionId); // Admin joins the chat room
        // Notify user that admin joined
        this.server.to(data.sessionId).emit('adminJoined', {
            adminId: data.adminId
        });
        return session;
    }
    async handleSendMessage(client, data) {
        const savedMessage = await this.liveChatService.saveMessage(data.sessionId, data.message, data.sender);
        // Broadcast to everyone in the room (User + Admin)
        this.server.to(data.sessionId).emit('newMessage', savedMessage);
        return savedMessage;
    }
    async handleTyping(client, data) {
        client.to(data.sessionId).emit('typingStatus', data);
    }
    async handleAdminEndSession(client, data) {
        // Update session status in database
        await this.liveChatService.endSession(data.sessionId);
        // Send a system message to the session
        const systemMessage = await this.liveChatService.saveMessage(data.sessionId, 'This chat session has been ended by the support agent. Thank you for contacting us!', 'SYSTEM');
        // Broadcast the system message first
        this.server.to(data.sessionId).emit('newMessage', systemMessage);
        // Then notify everyone in the session that it has ended
        this.server.to(data.sessionId).emit('sessionEnded', data.sessionId);
        // Also notify admin room
        this.server.to('admin-room').emit('sessionEnded', data.sessionId);
        return {
            status: 'session ended',
            sessionId: data.sessionId
        };
    }
    constructor(liveChatService){
        this.liveChatService = liveChatService;
    }
};
_ts_decorate([
    (0, _websockets.WebSocketServer)(),
    _ts_metadata("design:type", typeof _socketio.Server === "undefined" ? Object : _socketio.Server)
], LiveChatGateway.prototype, "server", void 0);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('startChat'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatGateway.prototype, "handleStartChat", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('joinAdminRoom'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatGateway.prototype, "handleJoinAdminRoom", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('adminJoinSession'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatGateway.prototype, "handleAdminJoinSession", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('sendMessage'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatGateway.prototype, "handleSendMessage", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('typing'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatGateway.prototype, "handleTyping", null);
_ts_decorate([
    (0, _websockets.SubscribeMessage)('adminEndSession'),
    _ts_param(0, (0, _websockets.ConnectedSocket)()),
    _ts_param(1, (0, _websockets.MessageBody)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _socketio.Socket === "undefined" ? Object : _socketio.Socket,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], LiveChatGateway.prototype, "handleAdminEndSession", null);
LiveChatGateway = _ts_decorate([
    (0, _websockets.WebSocketGateway)({
        cors: {
            origin: '*'
        },
        namespace: 'live-chat'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _livechatservice.LiveChatService === "undefined" ? Object : _livechatservice.LiveChatService
    ])
], LiveChatGateway);

//# sourceMappingURL=live-chat.gateway.js.map