import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { email: string; name: string; password: string }) {
    return this.userService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { email?: string; name?: string; password?: string }) {
    return this.userService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
} 