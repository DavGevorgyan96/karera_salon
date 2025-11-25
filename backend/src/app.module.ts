import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StaffModule } from './staff/staff.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SettingsModule } from './settings/settings.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { BlockedTimesModule } from './blocked-times/blocked-times.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StaffModule,
    ServicesModule,
    AppointmentsModule,
    ReviewsModule,
    SettingsModule,
    SpecializationsModule,
    BlockedTimesModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
