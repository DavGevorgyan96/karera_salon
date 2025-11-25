import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async checkAvailability(staffId: string, date: string, timeFrom: string): Promise<boolean> {
    // Simple check: is there any appointment at this time for this staff?
    if (!staffId) return true; 
    
    const checkDate = new Date(date);
    // Parse time "HH:mm" to Date object (using epoch date for time comparison)
    const checkTime = new Date(`1970-01-01T${timeFrom}:00`);

    // Check if the requested start time falls within any existing appointment
    const existing = await this.prisma.appointment.findFirst({
      where: {
        staffId,
        date: checkDate,
        status: { not: AppointmentStatus.CANCELED },
        AND: [
          { timeFrom: { lte: checkTime } },
          { timeTo: { gt: checkTime } }
        ]
      },
    });
    return !existing;
  }

  async create(data: any) {
    // Calculate timeTo based on service duration
    const service = await this.prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error('Service not found');

    const timeFromDate = new Date(`1970-01-01T${data.timeFrom}:00`);
    const timeToDate = new Date(timeFromDate.getTime() + service.durationMinutes * 60000);

    return this.prisma.appointment.create({
      data: {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        serviceId: data.serviceId,
        staffId: data.staffId || null,
        date: new Date(data.date),
        timeFrom: timeFromDate,
        timeTo: timeToDate,
        status: AppointmentStatus.NEW,
        commentFromClient: data.commentFromClient,
      },
    });
  }

  findAll(query: any) {
    const where: any = {};
    if (query.date) where.date = new Date(query.date);
    if (query.staffId) where.staffId = query.staffId;
    if (query.status) where.status = query.status;

    return this.prisma.appointment.findMany({
      where,
      include: { staff: true, service: true },
      orderBy: { date: 'asc' },
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as AppointmentStatus },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    
    // Recalculate timeTo if timeFrom or serviceId changes
    if (data.timeFrom || data.serviceId) {
      const appointment = await this.prisma.appointment.findUnique({ where: { id } });
      if (!appointment) throw new Error('Appointment not found');

      const serviceId = data.serviceId || appointment.serviceId;
      const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
      if (!service) throw new Error('Service not found');

      const timeFromStr = data.timeFrom 
        ? (data.timeFrom.includes('T') ? data.timeFrom.split('T')[1].substring(0, 5) : data.timeFrom)
        : appointment.timeFrom.toISOString().split('T')[1].substring(0, 5);

      const timeFromDate = new Date(`1970-01-01T${timeFromStr}:00`);
      const timeToDate = new Date(timeFromDate.getTime() + service.durationMinutes * 60000);

      updateData.timeFrom = timeFromDate;
      updateData.timeTo = timeToDate;
      
      if (data.date) {
        updateData.date = new Date(data.date);
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: string) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
