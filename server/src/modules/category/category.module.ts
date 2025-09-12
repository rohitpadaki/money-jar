import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../models/category.entity';
import { CategoryService } from '../../services/category/category.service';
import { CategoryController } from '../../controllers/category/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [TypeOrmModule.forFeature([Category])]
})
export class CategoryModule {}
