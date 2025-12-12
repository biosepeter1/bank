"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportService", {
    enumerable: true,
    get: function() {
        return SupportService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../../prisma/prisma.service");
const _emailservice = require("../../common/services/email.service");
const _supportgateway = require("./support.gateway");
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
let SupportService = class SupportService {
    /**
   * Create a new support ticket
   */ async createTicket(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailTransactions: true
            }
        });
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        const ticket = await this.prisma.supportTicket.create({
            data: {
                userId,
                subject: data.subject,
                message: data.message,
                category: data.category,
                priority: data.priority || 'MEDIUM',
                status: 'OPEN'
            }
        });
        // Send confirmation email
        try {
            if (user.emailTransactions) {
                await this.emailService.sendGenericNotification({
                    email: user.email,
                    title: '🎫 Support Ticket Created',
                    message: `Hi ${user.firstName},<br><br>Your support ticket has been created successfully.<br><br><strong>Ticket ID:</strong> #${ticket.id.substring(0, 8).toUpperCase()}<br><strong>Subject:</strong> ${ticket.subject}<br><strong>Category:</strong> ${ticket.category}<br><strong>Priority:</strong> ${ticket.priority}<br><br>Our support team will review your request and get back to you as soon as possible. You can track the status of your ticket in your account.`,
                    actionLabel: 'View Ticket',
                    actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/support`
                });
            }
        } catch (error) {
            console.error('Failed to send ticket creation email:', error);
        }
        // Create in-app notification
        await this.prisma.notification.create({
            data: {
                userId,
                title: 'Support Ticket Created',
                message: `Your support ticket #${ticket.id.substring(0, 8).toUpperCase()} has been created. We'll respond soon.`,
                type: 'INFO'
            }
        });
        return ticket;
    }
    /**
   * Create a guest support ticket from contact form (no auth required)
   */ async createGuestTicket(data) {
        // For guest tickets, prepend visitor info to the message
        const guestInfoPrefix = `[GUEST CONTACT]\nName: ${data.name}\nEmail: ${data.email}\n---\n\n`;
        const fullMessage = guestInfoPrefix + data.message;
        // Get or create a system "guest" user for contact forms
        let guestUser = await this.prisma.user.findFirst({
            where: {
                email: 'guest@contact.system'
            }
        });
        if (!guestUser) {
            guestUser = await this.prisma.user.create({
                data: {
                    email: 'guest@contact.system',
                    phone: '+0000000000',
                    password: 'not-a-real-password-hash',
                    firstName: 'Guest',
                    lastName: 'Contact',
                    role: 'USER',
                    accountStatus: 'ACTIVE'
                }
            });
        }
        // Create ticket with guest user
        const ticket = await this.prisma.supportTicket.create({
            data: {
                userId: guestUser.id,
                subject: data.subject || `Contact from ${data.name}: ${data.category || 'General Inquiry'}`,
                message: fullMessage,
                category: data.category || 'General',
                priority: 'MEDIUM',
                status: 'OPEN'
            }
        });
        // Send confirmation email to the guest
        try {
            await this.emailService.sendGenericNotification({
                email: data.email,
                title: '📩 We Received Your Message',
                message: `Hi ${data.name},<br><br>Thank you for contacting us! We have received your message and our support team will respond within 24 hours.<br><br><strong>Reference:</strong> #${ticket.id.substring(0, 8).toUpperCase()}<br><strong>Subject:</strong> ${ticket.subject}<br><br>If you have an account with us, you can login to track your request in the Support section.`,
                actionLabel: 'Visit Our Website',
                actionUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
            });
        } catch (error) {
            console.error('Failed to send guest confirmation email:', error);
        }
        // Send notification to admin/support email
        try {
            const settings = await this.prisma.systemSetting.findFirst({
                where: {
                    key: 'general.supportEmail'
                }
            });
            const adminEmail = settings?.value || process.env.ADMIN_EMAIL || 'admin@example.com';
            await this.emailService.sendGenericNotification({
                email: adminEmail,
                title: '🔔 New Contact Form Submission',
                message: `A new contact form has been submitted:<br><br><strong>From:</strong> ${data.name} (${data.email})<br><strong>Category:</strong> ${data.category || 'Not specified'}<br><strong>Subject:</strong> ${data.subject || 'Not specified'}<br><strong>Reference:</strong> #${ticket.id.substring(0, 8).toUpperCase()}<br><br><strong>Message:</strong><br>${data.message}`,
                actionLabel: 'View in Admin Panel',
                actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/support`
            });
        } catch (error) {
            console.error('Failed to send admin notification email:', error);
        }
        return {
            success: true,
            message: 'Your message has been received. We will respond within 24 hours.',
            reference: ticket.id.substring(0, 8).toUpperCase()
        };
    }
    /**
   * Get all tickets for a user
   */ async getUserTickets(userId) {
        return this.prisma.supportTicket.findMany({
            where: {
                userId
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    /**
   * Get a specific ticket
   */ async getTicket(userId, ticketId) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
        if (!ticket || ticket.userId !== userId) {
            throw new _common.NotFoundException('Ticket not found');
        }
        return ticket;
    }
    /**
   * Admin: Get all tickets
   */ async getAllTickets(status) {
        return this.prisma.supportTicket.findMany({
            where: status ? {
                status
            } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    /**
   * Admin: Get a specific ticket
   */ async getAdminTicket(ticketId) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
        if (!ticket) {
            throw new _common.NotFoundException('Ticket not found');
        }
        return ticket;
    }
    /**
   * Admin: Update ticket status
   */ async updateTicket(ticketId, adminId, data) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                user: true
            }
        });
        if (!ticket) {
            throw new _common.NotFoundException('Ticket not found');
        }
        const updated = await this.prisma.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                ...data,
                assignedTo: data.assignedTo || ticket.assignedTo,
                resolvedAt: data.status === 'RESOLVED' || data.status === 'CLOSED' ? new Date() : ticket.resolvedAt,
                resolution: data.resolution || ticket.resolution
            }
        });
        // Notify user of status change
        if (data.status && data.status !== ticket.status) {
            await this.prisma.notification.create({
                data: {
                    userId: ticket.userId,
                    title: 'Support Ticket Updated',
                    message: `Your ticket #${ticket.id.substring(0, 8).toUpperCase()} status has been updated to ${data.status.replace('_', ' ')}`,
                    type: 'INFO'
                }
            });
            // Send conversation summary email if resolved
            if ((data.status === 'RESOLVED' || data.status === 'CLOSED') && ticket.user.emailTransactions) {
                try {
                    // Fetch all messages for this ticket
                    const ticketWithMessages = await this.prisma.supportTicket.findUnique({
                        where: {
                            id: ticketId
                        },
                        include: {
                            messages: {
                                orderBy: {
                                    createdAt: 'asc'
                                }
                            },
                            user: true
                        }
                    });
                    if (ticketWithMessages) {
                        // Build conversation HTML
                        let conversationHtml = `<div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0">`;
                        // Original message
                        conversationHtml += `
              <div style="margin-bottom:16px;padding:12px;background:#fff;border-radius:8px;border-left:3px solid #3b82f6">
                <div style="font-size:12px;color:#64748b;margin-bottom:4px">
                  <strong>${ticketWithMessages.user.firstName} ${ticketWithMessages.user.lastName}</strong> • ${new Date(ticketWithMessages.createdAt).toLocaleString()}
                </div>
                <div style="color:#334155">${ticketWithMessages.message}</div>
              </div>`;
                        // All replies
                        ticketWithMessages.messages?.forEach((msg)=>{
                            const isSupport = msg.senderType === 'ADMIN';
                            conversationHtml += `
                <div style="margin-bottom:16px;padding:12px;background:${isSupport ? '#dcfce7' : '#fff'};border-radius:8px;border-left:3px solid ${isSupport ? '#16a34a' : '#3b82f6'}">
                  <div style="font-size:12px;color:#64748b;margin-bottom:4px">
                    <strong>${msg.senderName}</strong> • ${new Date(msg.createdAt).toLocaleString()}
                  </div>
                  <div style="color:#334155">${msg.message}</div>
                </div>`;
                        });
                        conversationHtml += `</div>`;
                        await this.emailService.sendGenericNotification({
                            email: ticketWithMessages.user.email,
                            title: '✅ Support Ticket Resolved - Full Conversation',
                            message: `Hi ${ticketWithMessages.user.firstName},<br><br>Your support ticket has been ${data.status === 'RESOLVED' ? 'resolved' : 'closed'}.<br><br><strong>Ticket ID:</strong> #${ticket.id.substring(0, 8).toUpperCase()}<br><strong>Subject:</strong> ${ticket.subject}${data.resolution ? `<br><br><strong>Resolution:</strong><br>${data.resolution}` : ''}<br><br><strong>Full Conversation:</strong>${conversationHtml}<br>If you have any further questions, feel free to create a new support ticket.`,
                            actionLabel: 'View Tickets',
                            actionUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/support`
                        });
                    }
                } catch (error) {
                    console.error('Failed to send ticket resolution email:', error);
                }
            }
        }
        // Audit log
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: 'admin',
                actorRole: 'BANK_ADMIN',
                action: 'SETTINGS_CHANGED',
                entity: 'SupportTicket',
                entityId: ticketId,
                description: `Updated support ticket #${ticket.id.substring(0, 8).toUpperCase()}`,
                metadata: data
            }
        });
        return updated;
    }
    /**
   * Admin: Delete ticket
   */ async deleteTicket(ticketId, adminId) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            }
        });
        if (!ticket) {
            throw new _common.NotFoundException('Ticket not found');
        }
        await this.prisma.supportTicket.delete({
            where: {
                id: ticketId
            }
        });
        await this.prisma.auditLog.create({
            data: {
                userId: adminId,
                actorEmail: 'admin',
                actorRole: 'BANK_ADMIN',
                action: 'USER_DELETED',
                entity: 'SupportTicket',
                entityId: ticketId,
                description: `Deleted support ticket #${ticket.id.substring(0, 8).toUpperCase()}`
            }
        });
        return {
            message: 'Ticket deleted successfully'
        };
    }
    /**
   * User: Add a reply to ticket
   */ async addUserReply(userId, ticketId, message) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                user: true
            }
        });
        if (!ticket || ticket.userId !== userId) {
            throw new _common.NotFoundException('Ticket not found');
        }
        if (ticket.status === 'CLOSED') {
            throw new _common.BadRequestException('Cannot reply to a closed ticket');
        }
        const reply = await this.prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: userId,
                senderName: `${ticket.user.firstName} ${ticket.user.lastName}`,
                senderType: 'USER',
                message
            }
        });
        // Update ticket timestamp
        await this.prisma.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                updatedAt: new Date()
            }
        });
        // Emit real-time event
        this.supportGateway.emitNewMessage(ticketId, reply);
        return reply;
    }
    /**
   * Admin: Add a reply to ticket
   */ async addAdminReply(adminId, ticketId, message) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            },
            include: {
                user: true
            }
        });
        if (!ticket) {
            throw new _common.NotFoundException('Ticket not found');
        }
        const admin = await this.prisma.user.findUnique({
            where: {
                id: adminId
            }
        });
        if (!admin) {
            throw new _common.NotFoundException('Admin not found');
        }
        const reply = await this.prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: adminId,
                senderName: 'Support Team',
                senderType: 'ADMIN',
                message
            }
        });
        // Update ticket timestamp and set to IN_PROGRESS if OPEN
        await this.prisma.supportTicket.update({
            where: {
                id: ticketId
            },
            data: {
                updatedAt: new Date(),
                status: ticket.status === 'OPEN' ? 'IN_PROGRESS' : ticket.status
            }
        });
        // Notify user
        await this.prisma.notification.create({
            data: {
                userId: ticket.userId,
                title: 'New Reply on Support Ticket',
                message: `Support team replied to your ticket: ${ticket.subject}`,
                type: 'INFO'
            }
        });
        // Emit real-time event
        this.supportGateway.emitNewMessage(ticketId, reply);
        return reply;
    }
    /**
   * Admin: Send email reply to guest contact form submission
   */ async sendGuestEmailReply(ticketId, data, admin) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: {
                id: ticketId
            }
        });
        if (!ticket) {
            throw new _common.NotFoundException('Ticket not found');
        }
        // Send email to guest
        try {
            await this.emailService.sendGenericNotification({
                email: data.guestEmail,
                title: `📧 Reply: ${data.subject}`,
                message: `
          <p>Hi ${data.guestName},</p>
          <p>Thank you for contacting us. Here's our response to your inquiry:</p>
          <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #007bff;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>Reference:</strong> #${ticket.id.substring(0, 8).toUpperCase()}</p>
          <p style="color: #666; font-size: 14px;">
            <em>Replied by: Support Team</em>
          </p>
          <p>If you have any further questions, feel free to reply to this email or visit our website.</p>
        `,
                actionLabel: 'Visit Our Website',
                actionUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
            });
            // Also add a record in ticket messages for audit trail
            await this.prisma.ticketMessage.create({
                data: {
                    ticketId,
                    senderId: 'system',
                    senderName: `${admin.firstName} ${admin.lastName} (via Email)`,
                    senderType: 'ADMIN',
                    message: `[EMAIL SENT TO: ${data.guestEmail}]\n\n${data.message}`
                }
            });
            // Update ticket status
            await this.prisma.supportTicket.update({
                where: {
                    id: ticketId
                },
                data: {
                    updatedAt: new Date(),
                    status: 'IN_PROGRESS'
                }
            });
            return {
                success: true,
                message: `Email sent successfully to ${data.guestEmail}`
            };
        } catch (error) {
            console.error('Failed to send guest email reply:', error);
            throw new Error('Failed to send email. Please check SMTP configuration.');
        }
    }
    constructor(prisma, emailService, supportGateway){
        this.prisma = prisma;
        this.emailService = emailService;
        this.supportGateway = supportGateway;
    }
};
SupportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _common.Inject)((0, _common.forwardRef)(()=>_supportgateway.SupportGateway))),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService,
        typeof _supportgateway.SupportGateway === "undefined" ? Object : _supportgateway.SupportGateway
    ])
], SupportService);

//# sourceMappingURL=support.service.js.map