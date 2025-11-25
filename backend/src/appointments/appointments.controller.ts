import { Controller, Get, Post, Body, Param, Put, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.appointmentsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }
}
