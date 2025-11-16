// src/category/category.controller.ts
import { Controller, Get, Post, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.entity';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({summary: "Get all categories"})
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @ApiOperation({summary: "Find one category by ID"})
  @ApiParam({name: "id", description: "ID of the category"})
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    let category = await this.categoryService.findOne(id);
    if (!category) throw new NotFoundException('Category does not exist');

    return category;
  }

  @ApiOperation({summary: "Create a new category"})
  @Post()
  async create(@Body() category: Partial<Category>): Promise<Category> {
    return await this.categoryService.create(category);
  }

  @ApiOperation({summary: "Delete a category by ID"})
  @ApiParam({name: "id", description: "ID of the category to be deleted"})
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoryService.remove(id);
  }
}
