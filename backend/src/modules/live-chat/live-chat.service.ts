import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LiveChatService {
    constructor(private prisma: PrismaService) { }

    async createSession(data: { socketId: string; userId?: string; userIp?: string }) {
        return this.prisma.chatSession.create({
            data: {
                socketId: data.socketId,
                userId: data.userId,
                userIp: data.userIp,
                status: 'QUEUED',
            },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                messages: true,
            },
        });
    }

    async getSessions(status?: 'QUEUED' | 'ACTIVE' | 'ENDED') {
        return this.prisma.chatSession.findMany({
            where: status ? { status } : undefined,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                admin: { select: { firstName: true, lastName: true } },
                messages: {
                    orderBy: { createdAt: 'asc' }
                },
            },
        });
    }

    async getSession(id: string) {
        return this.prisma.chatSession.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
                user: { select: { firstName: true, lastName: true, email: true } },
                admin: { select: { firstName: true, lastName: true } },
            },
        });
    }

    async assignAdminToSession(sessionId: string, adminId: string) {
        return this.prisma.chatSession.update({
            where: { id: sessionId },
            data: {
                adminId,
                status: 'ACTIVE',
            },
        });
    }

    async saveMessage(sessionId: string, message: string, sender: 'USER' | 'ADMIN' | 'SYSTEM') {
        return this.prisma.chatMessage.create({
            data: {
                sessionId,
                message,
                sender,
            },
        });
    }

    async endSession(sessionId: string) {
        return this.prisma.chatSession.update({
            where: { id: sessionId },
            data: { status: 'ENDED' },
        });
    }
}
