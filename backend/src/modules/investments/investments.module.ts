import { Module } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { InvestmentsController } from './investments.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [InvestmentsController],
  providers: [InvestmentsService, PrismaService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
