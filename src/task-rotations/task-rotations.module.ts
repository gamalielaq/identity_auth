import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FamilyMember } from "../members/entities/family-member.entity";
import { Task } from "../tasks/entities/task.entity";
import { TaskRotationMember } from "./entities/task-rotation-member.entity";
import { TaskRotationsController } from "./task-rotations.controller";
import { TaskRotationsService } from "./task-rotations.service";

@Module({
  imports: [TypeOrmModule.forFeature([TaskRotationMember, Task, FamilyMember])],
  controllers: [TaskRotationsController],
  providers: [TaskRotationsService],
  exports: [TaskRotationsService],
})
export class TaskRotationsModule {}
