import { Module } from '@nestjs/common';
import { BlockedTimesService } from './blocked-times.service';
import { BlockedTimesController } from './blocked-times.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BlockedTimesController],
  providers: [BlockedTimesService, PrismaService],
})
export class BlockedTimesModule {}
