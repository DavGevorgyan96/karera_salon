import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpecializationsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.specialization.findMany();
  }

  create(name: string) {
    return this.prisma.specialization.create({ data: { name } });
  }

  remove(id: string) {
    return this.prisma.specialization.delete({ where: { id } });
  }
}
