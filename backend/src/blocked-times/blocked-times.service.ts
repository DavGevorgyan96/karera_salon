import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlockedTimesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blockedTime.findMany({
      include: { staff: true },
    });
  }

  async create(data: any) {
    // Ensure date is a Date object
    const date = new Date(data.date);
    
    // Handle times. Assuming they come as "HH:mm" strings or ISO strings.
    // If "HH:mm", we need to attach them to a dummy date or the actual date.
    // Prisma @db.Time stores just the time part usually, but in JS it's a Date object.
    // Best practice for Prisma Time is to use a fixed date like 1970-01-01.
    
    let timeFrom = null;
    let timeTo = null;

    if (data.timeFrom) {
      timeFrom = new Date(`1970-01-01T${data.timeFrom}`);
      if (isNaN(timeFrom.getTime())) {
         // Try parsing as full ISO if needed, or handle error
         timeFrom = new Date(data.timeFrom);
      }
    }

    if (data.timeTo) {
      timeTo = new Date(`1970-01-01T${data.timeTo}`);
      if (isNaN(timeTo.getTime())) {
         timeTo = new Date(data.timeTo);
      }
    }

    return this.prisma.blockedTime.create({
      data: {
        date: date,
        timeFrom: timeFrom,
        timeTo: timeTo,
        reason: data.reason,
        staffId: data.staffId || null,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.blockedTime.delete({ where: { id } });
  }
}
