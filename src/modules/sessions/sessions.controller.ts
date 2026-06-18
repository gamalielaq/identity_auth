import { Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async findActive() {
    const data = await this.sessionsService.findActive();
    return { data };
  }

  @Post(":id/revoke")
  async revoke(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.sessionsService.revoke(id);
    return { data, message: "Session revoked successfully" };
  }
}
