import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskCategory } from "./entities/task-category.entity";
import { TaskCategoriesController } from "./task-categories.controller";
import { TaskCategoriesService } from "./task-categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([TaskCategory])],
  controllers: [TaskCategoriesController],
  providers: [TaskCategoriesService],
  exports: [TaskCategoriesService],
})
export class TaskCategoriesModule {}
