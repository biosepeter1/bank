"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChatController", {
    enumerable: true,
    get: function() {
        return ChatController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
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
// Use environment variable for API key - NEVER commit API keys to git
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
let ChatController = class ChatController {
    async sendMessage(body) {
        const { message, history = [], siteName = 'Our Bank', supportPhone = '+234 800 900 7777', supportEmail = 'support@bank.com' } = body;
        console.log('📨 Chat AI request received:', {
            message,
            siteName
        });
        const systemPrompt = `You are a helpful and friendly customer support assistant for ${siteName}, a professional banking institution. 

Your role is to:
- Answer questions about banking services (accounts, cards, loans, transfers)
- Provide information about bank features and products
- Help customers with general inquiries
- Be professional, concise, and helpful
- If you cannot answer something, suggest contacting human support

Bank Info:
- Name: ${siteName}
- Support Phone: ${supportPhone}
- Support Email: ${supportEmail}

Keep responses SHORT and conversational (2-3 sentences max). Use emojis sparingly for a friendly tone.`;
        try {
            console.log('🔄 Calling Gemini API...');
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: systemPrompt
                                }
                            ]
                        },
                        {
                            role: 'model',
                            parts: [
                                {
                                    text: 'Understood! I\'m ready to help customers as a professional banking assistant.'
                                }
                            ]
                        },
                        ...history,
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: message
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 256,
                        topP: 0.8,
                        topK: 40
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        }
                    ]
                })
            });
            const data = await response.json();
            console.log('📥 Gemini API response status:', response.status);
            console.log('📥 Gemini API response data:', JSON.stringify(data, null, 2));
            // Check for API errors
            if (data.error) {
                console.error('❌ Gemini API error:', data.error);
                // Handle quota limits gracefully
                if (data.error.message?.includes('quota') || data.error.code === 429) {
                    return {
                        success: true,
                        response: 'I am currently receiving too many requests. Please try again in a few minutes. 🕒'
                    };
                }
                return {
                    success: false,
                    response: 'I apologize, but I am momentarily unavailable. Please try again later.',
                    debug: data.error
                };
            }
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                console.log('✅ AI Response:', aiResponse);
                return {
                    success: true,
                    response: aiResponse
                };
            }
            console.log('⚠️ No valid response from Gemini');
            return {
                success: false,
                response: 'I apologize, but I couldn\'t process your request. Please try again or contact our support team.',
                debug: data
            };
        } catch (error) {
            console.error('❌ Gemini AI fetch error:', error);
            return {
                success: false,
                response: 'I\'m having trouble connecting right now. Please try again or contact our support team directly.',
                error: error.message
            };
        }
    }
};
_ts_decorate([
    (0, _common.Post)('ai'),
    (0, _swagger.ApiOperation)({
        summary: 'Send message to AI chatbot'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
ChatController = _ts_decorate([
    (0, _swagger.ApiTags)('chat'),
    (0, _common.Controller)('chat')
], ChatController);

//# sourceMappingURL=chat.controller.js.map