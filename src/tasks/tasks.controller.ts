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
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<{ data: Task }> {
    const task = await this.tasksService.create(createTaskDto);
    return { data: task };
  }

  @Get()
  async findAll(): Promise<{ data: Task[] }> {
    const tasks = await this.tasksService.findAll();
    return { data: tasks };
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: Task }> {
    const task = await this.tasksService.findOne(id);
    return { data: task };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{ data: Task }> {
    const task = await this.tasksService.update(id, updateTaskDto);
    return { data: task };
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: Task; message: string }> {
    const task = await this.tasksService.remove(id);
    return { data: task, message: "Task deactivated successfully" };
  }
}
