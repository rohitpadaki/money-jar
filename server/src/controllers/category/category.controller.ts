// src/category/category.controller.ts
import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    let category = await this.categoryService.findOne(+id);
    if (!category) throw new NotFoundException('Category does not exist');

    return category;
  }

  @Post()
  async create(@Body() category: Partial<Category>): Promise<Category> {
    return await this.categoryService.create(category);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoryService.remove(+id);
  }
}
