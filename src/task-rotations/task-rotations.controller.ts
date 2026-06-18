import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from "@nestjs/common";
import { SetTaskRotationDto } from "./dto/set-task-rotation.dto";
import { TaskRotationMember } from "./entities/task-rotation-member.entity";
import { TaskRotationsService } from "./task-rotations.service";

@Controller("tasks/:taskId/rotation")
export class TaskRotationsController {
  constructor(private readonly taskRotationsService: TaskRotationsService) {}

  @Put()
  async setRotation(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Body() setTaskRotationDto: SetTaskRotationDto,
  ): Promise<{ data: TaskRotationMember[] }> {
    const rotation = await this.taskRotationsService.setRotation(
      taskId,
      setTaskRotationDto,
    );
    return { data: rotation };
  }

  @Get()
  async findByTask(
    @Param("taskId", ParseUUIDPipe) taskId: string,
  ): Promise<{ data: TaskRotationMember[] }> {
    const rotation = await this.taskRotationsService.findByTask(taskId);
    return { data: rotation };
  }

  @Delete(":memberId")
  async removeMember(
    @Param("taskId", ParseUUIDPipe) taskId: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
  ): Promise<{ data: null; message: string }> {
    await this.taskRotationsService.removeMember(taskId, memberId);
    return { data: null, message: "Task rotation member removed successfully" };
  }
}
