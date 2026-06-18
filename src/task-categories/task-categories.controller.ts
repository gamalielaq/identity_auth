import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateTaskCategoryDto } from "./dto/create-task-category.dto";
import { UpdateTaskCategoryDto } from "./dto/update-task-category.dto";
import { TaskCategory } from "./entities/task-category.entity";
import { TaskCategoriesService } from "./task-categories.service";

@Controller("task-categories")
export class TaskCategoriesController {
  constructor(private readonly taskCategoriesService: TaskCategoriesService) {}

  @Post()
  async create(
    @Body() createTaskCategoryDto: CreateTaskCategoryDto,
  ): Promise<{ data: TaskCategory }> {
    const taskCategory = await this.taskCategoriesService.create(
      createTaskCategoryDto,
    );
    return { data: taskCategory };
  }

  @Get()
  async findAll(): Promise<{ data: TaskCategory[] }> {
    const taskCategories = await this.taskCategoriesService.findAll();
    return { data: taskCategories };
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: TaskCategory }> {
    const taskCategory = await this.taskCategoriesService.findOne(id);
    return { data: taskCategory };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTaskCategoryDto: UpdateTaskCategoryDto,
  ): Promise<{ data: TaskCategory }> {
    const taskCategory = await this.taskCategoriesService.update(
      id,
      updateTaskCategoryDto,
    );
    return { data: taskCategory };
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: null; message: string }> {
    await this.taskCategoriesService.remove(id);
    return { data: null, message: "Task category deleted successfully" };
  }
}
