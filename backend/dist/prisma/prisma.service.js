"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaService", {
    enumerable: true,
    get: function() {
        return PrismaService;
    }
});
const _common = require("@nestjs/common");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PrismaService = class PrismaService extends _client.PrismaClient {
    async onModuleInit() {
        await this.connectWithRetry();
        this.startKeepAlive();
    }
    async connectWithRetry(attempt = 1) {
        try {
            await this.$connect();
            this.logger.log('✅ Database connected successfully');
        } catch (error) {
            this.logger.error(`❌ Database connection attempt ${attempt} failed: ${error.message}`);
            if (attempt < this.maxRetries) {
                const delay = this.retryDelay * attempt; // Exponential backoff
                this.logger.log(`⏳ Retrying in ${delay / 1000} seconds...`);
                await new Promise((resolve)=>setTimeout(resolve, delay));
                return this.connectWithRetry(attempt + 1);
            }
            this.logger.error('❌ Max connection retries reached. Database connection failed.');
            throw error;
        }
    }
    async onModuleDestroy() {
        this.stopKeepAlive();
        await this.$disconnect();
        this.logger.log('👋 Database disconnected');
    }
    // Start periodic keep-alive pings to prevent idle connection timeout
    startKeepAlive() {
        // Ping every 4 minutes (Supabase/PgBouncer typically times out at 5 min)
        const KEEP_ALIVE_INTERVAL = 4 * 60 * 1000; // 4 minutes
        this.keepAliveInterval = setInterval(async ()=>{
            try {
                await this.$queryRaw`SELECT 1`;
                this.logger.debug('💓 Database keep-alive ping successful');
            } catch (error) {
                this.logger.warn('⚠️ Keep-alive ping failed, attempting reconnect...');
                try {
                    await this.$disconnect();
                    await this.connectWithRetry();
                } catch (reconnectError) {
                    this.logger.error(`❌ Keep-alive reconnect failed: ${reconnectError}`);
                }
            }
        }, KEEP_ALIVE_INTERVAL);
        this.logger.log('💓 Database keep-alive started (4 min interval)');
    }
    // Stop keep-alive pings
    stopKeepAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
            this.logger.log('💓 Database keep-alive stopped');
        }
    }
    // Health check for database connection
    async isHealthy() {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            this.logger.error(`Database health check failed: ${error.message}`);
            return false;
        }
    }
    // Reconnect if connection is lost
    async ensureConnection() {
        const healthy = await this.isHealthy();
        if (!healthy) {
            this.logger.warn('🔄 Database connection lost, attempting to reconnect...');
            await this.$disconnect();
            await this.connectWithRetry();
        }
    }
    // Clean database (for testing)
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot clean database in production');
        }
        const models = Reflect.ownKeys(this).filter((key)=>key.toString().startsWith('_'));
        return Promise.all(models.map((modelKey)=>{
            const model = this[modelKey];
            if (model && typeof model.deleteMany === 'function') {
                return model.deleteMany();
            }
        }));
    }
    constructor(){
        super({
            log: process.env.NODE_ENV === 'production' ? [
                'error'
            ] : [
                'query',
                'error',
                'warn'
            ],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        }), this.logger = new _common.Logger(PrismaService.name), this.maxRetries = 5, this.retryDelay = 3000 // 3 seconds
        , this.keepAliveInterval = null;
    }
};
PrismaService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], PrismaService);

//# sourceMappingURL=prisma.service.js.map