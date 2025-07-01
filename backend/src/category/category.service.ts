import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Category } from '../../generated/prisma';

export interface CreateCategoryDto {
  name: string;
  slug: string;
  color: string;
  icon?: string;
}

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { events: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
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

  async updateCategory(id: number, data: Partial<CreateCategoryDto>): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}