"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WsJwtGuard", {
    enumerable: true,
    get: function() {
        return WsJwtGuard;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _websockets = require("@nestjs/websockets");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WsJwtGuard = class WsJwtGuard {
    async canActivate(context) {
        try {
            const client = context.switchToWs().getClient();
            const token = this.extractTokenFromHandshake(client);
            if (!token) {
                throw new _websockets.WsException('Unauthorized: No token provided');
            }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            });
            // Attach user info to the socket for later use
            client.data.user = payload;
            return true;
        } catch (error) {
            throw new _websockets.WsException('Unauthorized: Invalid token');
        }
    }
    extractTokenFromHandshake(client) {
        // Try to get token from handshake auth
        const authToken = client.handshake.auth?.token;
        if (authToken) {
            return authToken;
        }
        // Try to get token from handshake headers (Authorization: Bearer <token>)
        const authHeader = client.handshake.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        // Try to get token from query params
        const queryToken = client.handshake.query?.token;
        if (queryToken && typeof queryToken === 'string') {
            return queryToken;
        }
        return undefined;
    }
    constructor(jwtService){
        this.jwtService = jwtService;
    }
};
WsJwtGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], WsJwtGuard);

//# sourceMappingURL=ws-jwt.guard.js.map