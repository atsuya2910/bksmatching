import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TagService, CreateTagDto } from './tag.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Get()
  async getTags() {
    return this.tagService.getTags();
  }

  @Get(':id')
  async getTag(@Param('id') id: string) {
    return this.tagService.getTagById(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTag(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTagDto>
  ) {
    return this.tagService.updateTag(parseInt(id, 10), updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(parseInt(id, 10));
  }
}