import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskRecurrenceType } from "../common/enums/task-recurrence-type.enum";
import { TaskCategory } from "../task-categories/entities/task-category.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(TaskCategory)
    private readonly taskCategoriesRepository: Repository<TaskCategory>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    await this.ensureCategoryExists(createTaskDto.categoryId);

    const task = this.tasksRepository.create({
      ...createTaskDto,
      categoryId: createTaskDto.categoryId ?? null,
      description: createTaskDto.description ?? null,
      recurrenceType: createTaskDto.recurrenceType ?? TaskRecurrenceType.WEEKLY,
      dayOfWeek: createTaskDto.dayOfWeek ?? null,
    });

    return this.tasksRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: { category: true },
      order: { title: "ASC" },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} was not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    await this.ensureCategoryExists(updateTaskDto.categoryId);

    Object.assign(task, updateTaskDto);

    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.isActive = false;

    return this.tasksRepository.save(task);
  }

  private async ensureCategoryExists(
    categoryId?: string | null,
  ): Promise<void> {
    if (!categoryId) {
      return;
    }

    const exists = await this.taskCategoriesRepository.exists({
      where: { id: categoryId },
    });

    if (!exists) {
      throw new NotFoundException(
        `Task category with id ${categoryId} was not found`,
      );
    }
  }
}
