import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskCategory } from "../task-categories/entities/task-category.entity";
import { Task } from "./entities/task.entity";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskCategory])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
