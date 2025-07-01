import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Tag } from '../../generated/prisma';

export interface CreateTagDto {
  name: string;
  slug: string;
}

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async createTag(data: CreateTagDto): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  }

  async getTags(): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: { events: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getTagById(id: number): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            participants: true,
            organizer: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  }

  async updateTag(id: number, data: Partial<CreateTagDto>): Promise<Tag> {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  async deleteTag(id: number): Promise<Tag> {
    return this.prisma.tag.delete({
      where: { id },
    });
  }

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    
    for (const tagName of tagNames) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');
      
      let tag = await this.prisma.tag.findUnique({
        where: { slug }
      });
      
      if (!tag) {
        tag = await this.createTag({
          name: tagName,
          slug
        });
      }
      
      tags.push(tag);
    }
    
    return tags;
  }
}