import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { BlockedTimesService } from './blocked-times.service';

@Controller('blocked-times')
export class BlockedTimesController {
  constructor(private readonly blockedTimesService: BlockedTimesService) {}

  @Get()
  findAll() {
    return this.blockedTimesService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.blockedTimesService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockedTimesService.remove(id);
  }
}
