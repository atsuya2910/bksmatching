import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoryService, CreateCategoryDto } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return this.categoryService.getCategoryById(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCategoryDto>
  ) {
    return this.categoryService.updateCategory(parseInt(id, 10), updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(parseInt(id, 10));
  }
}