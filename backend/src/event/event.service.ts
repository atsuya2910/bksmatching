import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Event } from '../../generated/prisma';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: { title: string; description: string; location: string; eventDate: Date; organizerId: number }): Promise<Event> {
    const { organizerId, ...eventData } = data;
    return this.prisma.event.create({
      data: {
        ...eventData,
        organizer: { connect: { id: organizerId } },
      },
    });
  }

  async getEvents(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }

  async getEventById(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: { participants: true },
    });
  }

  async updateEvent(id: number, data: { title?: string; description?: string; location?: string; eventDate?: Date }): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data,
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
