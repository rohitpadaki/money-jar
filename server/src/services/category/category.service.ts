// src/category/category.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../models/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async findOne(id: number): Promise<Category | null> {
    return await this.categoryRepo.findOneBy({ id });
  }

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = await this.categoryRepo.create(category);
    return await this.categoryRepo.save(newCategory);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
