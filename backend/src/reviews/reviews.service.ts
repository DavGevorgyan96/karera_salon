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
      include: { staff: true },
    });
  }

  findAll(status?: string) {
    const where: any = {};
    if (status) where.status = status as ReviewStatus;
    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { staff: true },
    });
  }

  async updateStatus(id: string, status: string) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { status: status as ReviewStatus },
    });

    if (review.staffId) {
      await this.updateStaffRating(review.staffId);
    }

    return review;
  }

  async remove(id: string) {
    const review = await this.prisma.review.delete({
      where: { id },
    });

    if (review.staffId) {
      await this.updateStaffRating(review.staffId);
    }

    return review;
  }

  private async updateStaffRating(staffId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        staffId,
        status: ReviewStatus.APPROVED,
      },
      select: { rating: true },
    });

    const count = reviews.length;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = count > 0 ? total / count : 5.0;

    await this.prisma.staff.update({
      where: { id: staffId },
      data: { rating: average },
    });
  }
}
