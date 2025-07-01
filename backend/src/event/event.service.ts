import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Event } from '@prisma/client';

export interface EventSearchOptions {
  search?: string;
  location?: string;
  dateFrom?: Date;
  dateTo?: Date;
  categoryId?: number;
  tags?: string[];
  sortBy?: 'eventDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: { 
    title: string; 
    description: string; 
    location: string; 
    eventDate: Date; 
    organizerId: number;
    categoryId?: number;
    tagIds?: number[];
  }): Promise<Event> {
    const { organizerId, categoryId, tagIds, ...eventData } = data;
    
    const createData: any = {
      ...eventData,
      organizer: { connect: { id: organizerId } },
    };

    if (categoryId) {
      createData.category = { connect: { id: categoryId } };
    }

    if (tagIds && tagIds.length > 0) {
      createData.tags = {
        connect: tagIds.map(id => ({ id }))
      };
    }

    return this.prisma.event.create({
      data: createData,
      include: {
        participants: true,
        organizer: {
          select: { id: true, name: true, email: true }
        },
        category: true,
        tags: true,
      }
    });
  }

  async getEvents(options?: EventSearchOptions): Promise<Event[]> {
    const {
      search,
      location,
      dateFrom,
      dateTo,
      categoryId,
      tags,
      sortBy = 'eventDate',
      sortOrder = 'asc'
    } = options || {};

    const where: any = {};

    // 検索条件の構築
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (dateFrom || dateTo) {
      where.eventDate = {};
      if (dateFrom) {
        where.eventDate.gte = dateFrom;
      }
      if (dateTo) {
        where.eventDate.lte = dateTo;
      }
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          slug: { in: tags }
        }
      };
    }

    return this.prisma.event.findMany({
      where,
      include: {
        participants: true,
        organizer: {
          select: { id: true, name: true, email: true }
        },
        category: true,
        tags: true,
      },
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async getEventById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: { 
        participants: true,
        organizer: {
          select: { id: true, name: true, email: true }
        },
        category: true,
        tags: true,
      },
    });
  }

  async updateEvent(id: number, data: { 
    title?: string; 
    description?: string; 
    location?: string; 
    eventDate?: Date;
    categoryId?: number;
    tagIds?: number[];
  }): Promise<Event> {
    const { categoryId, tagIds, ...updateData } = data;
    
    const updatePayload: any = { ...updateData };

    if (categoryId !== undefined) {
      if (categoryId === null) {
        updatePayload.category = { disconnect: true };
      } else {
        updatePayload.category = { connect: { id: categoryId } };
      }
    }

    if (tagIds !== undefined) {
      // 既存のタグをすべて削除してから新しいタグを追加
      updatePayload.tags = {
        set: tagIds.map(id => ({ id }))
      };
    }

    return this.prisma.event.update({
      where: { id },
      data: updatePayload,
      include: {
        participants: true,
        organizer: {
          select: { id: true, name: true, email: true }
        },
        category: true,
        tags: true,
      }
    });
  }

  async deleteEvent(id: number): Promise<Event> {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  async joinEvent(eventId: number, userId: number): Promise<Event> {
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
    });
  }

  async leaveEvent(eventId: number, userId: number): Promise<Event> {
    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          disconnect: { id: userId },
        },
      },
    });
  }
}
