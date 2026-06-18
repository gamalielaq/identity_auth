import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { Family } from "./entities/family.entity";
import { FamiliesService } from "./families.service";

@Controller("families")
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: Family }> {
    const family = await this.familiesService.findOne(id);
    return { data: family };
  }
}
