import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.review.create({
      data: {
        ...data,
        status: ReviewStatus.PENDING,
      },
    });
  }

  findApproved() {
    return this.prisma.review.findMany({
      where: { status: ReviewStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status as ReviewStatus;
    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.review.update({
      where: { id },
      data: { status: status as ReviewStatus },
    });
  }
}
