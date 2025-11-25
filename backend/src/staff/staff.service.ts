import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.staff.findMany({
      where: { isActive: true },
      include: { specialization: true },
    });
  }

  findOne(id: string) {
    return this.prisma.staff.findUnique({
      where: { id },
      include: { specialization: true },
    });
  }

  create(data: any) {
    return this.prisma.staff.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.staff.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
