import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: any) {
    // Basic validation
    const { date, timeFrom, staffId } = createAppointmentDto;
    const isAvailable = await this.appointmentsService.checkAvailability(staffId, date, timeFrom);
    if (!isAvailable) {
      throw new BadRequestException('Selected time slot is not available');
    }
    return this.appointmentsService.create(createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  findAll(@Query() query: any) {
    return this.appointmentsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: any) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
