import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTaskCategoryDto } from "./dto/create-task-category.dto";
import { UpdateTaskCategoryDto } from "./dto/update-task-category.dto";
import { TaskCategory } from "./entities/task-category.entity";

@Injectable()
export class TaskCategoriesService {
  constructor(
    @InjectRepository(TaskCategory)
    private readonly taskCategoriesRepository: Repository<TaskCategory>,
  ) {}

  async create(
    createTaskCategoryDto: CreateTaskCategoryDto,
  ): Promise<TaskCategory> {
    await this.ensureNameIsAvailable(createTaskCategoryDto.name);

    const taskCategory = this.taskCategoriesRepository.create({
      ...createTaskCategoryDto,
      description: createTaskCategoryDto.description ?? null,
    });

    return this.taskCategoriesRepository.save(taskCategory);
  }

  findAll(): Promise<TaskCategory[]> {
    return this.taskCategoriesRepository.find({
      order: { name: "ASC" },
    });
  }

  async findOne(id: string): Promise<TaskCategory> {
    const taskCategory = await this.taskCategoriesRepository.findOne({
      where: { id },
    });

    if (!taskCategory) {
      throw new NotFoundException(`Task category with id ${id} was not found`);
    }

    return taskCategory;
  }

  async update(
    id: string,
    updateTaskCategoryDto: UpdateTaskCategoryDto,
  ): Promise<TaskCategory> {
    const taskCategory = await this.findOne(id);

    if (
      updateTaskCategoryDto.name &&
      updateTaskCategoryDto.name !== taskCategory.name
    ) {
      await this.ensureNameIsAvailable(updateTaskCategoryDto.name, id);
    }

    Object.assign(taskCategory, updateTaskCategoryDto);

    return this.taskCategoriesRepository.save(taskCategory);
  }

  async remove(id: string): Promise<void> {
    const taskCategory = await this.findOne(id);
    await this.taskCategoriesRepository.remove(taskCategory);
  }

  private async ensureNameIsAvailable(
    name: string,
    currentTaskCategoryId?: string,
  ): Promise<void> {
    const existingTaskCategory = await this.taskCategoriesRepository.findOne({
      where: { name },
    });

    if (
      existingTaskCategory &&
      existingTaskCategory.id !== currentTaskCategoryId
    ) {
      throw new ConflictException(`Task category ${name} already exists`);
    }
  }
}
