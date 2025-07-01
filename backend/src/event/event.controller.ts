import { Controller, Get, Post, Body, UseGuards, Request, Param, Put, Delete, Query } from '@nestjs/common';
import { EventService, EventSearchOptions } from './event.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '../../generated/prisma';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(
    @Request() req,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    console.log('req.user:', req.user);
    const { title, description, location, eventDate, categoryId, tagIds } = createEventDto;
    return this.eventService.createEvent({
      title,
      description,
      location,
      eventDate: new Date(eventDate),
      organizerId: req.user.sub,
      categoryId,
      tagIds,
    });
  }

  @Get()
  async getEvents(
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('categoryId') categoryId?: string,
    @Query('tags') tags?: string,
    @Query('sortBy') sortBy?: 'eventDate' | 'createdAt' | 'title',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<Event[]> {
    const options: EventSearchOptions = {
      search,
      location,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      tags: tags ? tags.split(',') : undefined,
      sortBy,
      sortOrder,
    };
    
    return this.eventService.getEvents(options);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string): Promise<Event | null> {
    return this.eventService.getEventById(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.updateEvent(parseInt(id, 10), {
      ...updateEventDto,
      eventDate: updateEventDto.eventDate ? new Date(updateEventDto.eventDate) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') id: string): Promise<Event> {
    return this.eventService.deleteEvent(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinEvent(@Param('id') id: string, @Request() req): Promise<Event> {
    return this.eventService.joinEvent(parseInt(id, 10), req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leaveEvent(@Param('id') id: string, @Request() req): Promise<Event> {
    return this.eventService.leaveEvent(parseInt(id, 10), req.user.sub);
  }
}
