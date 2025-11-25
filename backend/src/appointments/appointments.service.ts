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
}
