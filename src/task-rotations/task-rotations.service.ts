import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { FamilyMember } from "../members/entities/family-member.entity";
import { Task } from "../tasks/entities/task.entity";
import { SetTaskRotationDto } from "./dto/set-task-rotation.dto";
import { TaskRotationMember } from "./entities/task-rotation-member.entity";

@Injectable()
export class TaskRotationsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TaskRotationMember)
    private readonly taskRotationMembersRepository: Repository<TaskRotationMember>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(FamilyMember)
    private readonly membersRepository: Repository<FamilyMember>,
  ) {}

  async setRotation(
    taskId: string,
    setTaskRotationDto: SetTaskRotationDto,
  ): Promise<TaskRotationMember[]> {
    await this.ensureTaskExists(taskId);
    this.ensureUniqueMembers(setTaskRotationDto);
    this.ensureUniquePositions(setTaskRotationDto);
    await this.ensureMembersExist(
      setTaskRotationDto.members.map((member) => member.memberId),
    );

    return this.dataSource.transaction(async (manager) => {
      await manager.delete(TaskRotationMember, { taskId });

      const rotationMembers = setTaskRotationDto.members.map((member) =>
        manager.create(TaskRotationMember, {
          taskId,
          memberId: member.memberId,
          position: member.position,
          isActive: true,
        }),
      );

      await manager.save(TaskRotationMember, rotationMembers);

      return manager.find(TaskRotationMember, {
        where: { taskId },
        relations: { member: true },
        order: { position: "ASC" },
      });
    });
  }

  async findByTask(taskId: string): Promise<TaskRotationMember[]> {
    await this.ensureTaskExists(taskId);

    return this.taskRotationMembersRepository.find({
      where: { taskId },
      relations: { member: true },
      order: { position: "ASC" },
    });
  }

  async removeMember(taskId: string, memberId: string): Promise<void> {
    await this.ensureTaskExists(taskId);

    const result = await this.taskRotationMembersRepository.delete({
      taskId,
      memberId,
    });

    if (!result.affected) {
      throw new NotFoundException(
        `Member with id ${memberId} is not part of the task rotation`,
      );
    }
  }

  private async ensureTaskExists(taskId: string): Promise<void> {
    const exists = await this.tasksRepository.exists({ where: { id: taskId } });

    if (!exists) {
      throw new NotFoundException(`Task with id ${taskId} was not found`);
    }
  }

  private async ensureMembersExist(memberIds: string[]): Promise<void> {
    const members = await this.membersRepository.find({
      where: { id: In(memberIds), isActive: true },
      select: { id: true },
    });
    const existingMemberIds = new Set(members.map((member) => member.id));
    const missingMemberIds = memberIds.filter(
      (memberId) => !existingMemberIds.has(memberId),
    );

    if (missingMemberIds.length > 0) {
      throw new NotFoundException(
        `Members were not found or are inactive: ${missingMemberIds.join(", ")}`,
      );
    }
  }

  private ensureUniqueMembers(setTaskRotationDto: SetTaskRotationDto): void {
    const memberIds = setTaskRotationDto.members.map(
      (member) => member.memberId,
    );
    const uniqueMemberIds = new Set(memberIds);

    if (uniqueMemberIds.size !== memberIds.length) {
      throw new BadRequestException("Rotation members must be unique");
    }
  }

  private ensureUniquePositions(setTaskRotationDto: SetTaskRotationDto): void {
    const positions = setTaskRotationDto.members.map(
      (member) => member.position,
    );
    const uniquePositions = new Set(positions);

    if (uniquePositions.size !== positions.length) {
      throw new BadRequestException("Rotation positions must be unique");
    }
  }
}
