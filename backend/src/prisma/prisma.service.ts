import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'production'
        ? ['error']
        : ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Database disconnected');
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
