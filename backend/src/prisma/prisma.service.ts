import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 3000; // 3 seconds

  constructor() {
    super({
      log: process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error(`❌ Database connection attempt ${attempt} failed: ${error.message}`);

      if (attempt < this.maxRetries) {
        const delay = this.retryDelay * attempt; // Exponential backoff
        this.logger.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.connectWithRetry(attempt + 1);
      }

      this.logger.error('❌ Max connection retries reached. Database connection failed.');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('👋 Database disconnected');
  }

  // Health check for database connection
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error(`Database health check failed: ${error.message}`);
      return false;
    }
  }

  // Reconnect if connection is lost
  async ensureConnection(): Promise<void> {
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

    const models = Reflect.ownKeys(this).filter((key) =>
      key.toString().startsWith('_'),
    );

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof PrismaService] as any;
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
      }),
    );
  }
}
