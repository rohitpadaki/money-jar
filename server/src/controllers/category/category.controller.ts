// src/category/category.controller.ts
import { Controller, Get, Post, Body, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard';

@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({summary: "Get all categories"})
  @ApiOkResponse({
    description: 'List of all categories',
    type: [Category],
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
  })
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @ApiOperation({summary: "Find one category by ID"})
  @ApiParam({name: "id", description: "ID of the category"})
  @ApiOkResponse({
    description: 'Category found',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category does not exist',
    schema: {
      example: { statusCode: 404, message: 'Category does not exist', error: 'Not Found' },
    },
  })  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    let category = await this.categoryService.findOne(id);
    if (!category) throw new NotFoundException('Category does not exist');

    return category;
  }

  @ApiOperation({summary: "Create a new category"})
  @ApiCreatedResponse({
    description: 'Category successfully created',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
  })  
  @Post()
  async create(@Body() category: Partial<Category>): Promise<Category> {
    return await this.categoryService.create(category);
  }

  @ApiOperation({summary: "Delete a category by ID"})
  @ApiParam({name: "id", description: "ID of the category to be deleted"})
  @ApiOkResponse({
    description: 'Category successfully deleted',
    schema: {
      example: null,
    },
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    schema: {
      example: { statusCode: 404, message: 'Category does not exist', error: 'Not Found' },
    },
  })  
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.categoryService.remove(id);
  }
}
