import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.usersService.findById(id);
    return { data };
  }

  @Patch(":id")
  async updateProfile(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const data = await this.usersService.updateProfile(id, updateProfileDto);
    return { data };
  }
}
