import { Controller, Get, Post, Body, Param, Put, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: any) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get('approved')
  findApproved() {
    return this.reviewsService.findApproved();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('status') status?: string) {
    return this.reviewsService.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.reviewsService.updateStatus(id, status);
  }
}
