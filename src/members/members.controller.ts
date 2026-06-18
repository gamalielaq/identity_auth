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
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { FamilyMember } from "./entities/family-member.entity";
import { MembersService } from "./members.service";

@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<{ data: FamilyMember }> {
    const member = await this.membersService.create(createMemberDto);
    return { data: member };
  }

  @Get()
  async findAll(): Promise<{ data: FamilyMember[] }> {
    const members = await this.membersService.findAll();
    return { data: members };
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: FamilyMember }> {
    const member = await this.membersService.findOne(id);
    return { data: member };
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<{ data: FamilyMember }> {
    const member = await this.membersService.update(id, updateMemberDto);
    return { data: member };
  }

  @Delete(":id")
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<{ data: FamilyMember; message: string }> {
    const member = await this.membersService.remove(id);
    return { data: member, message: "Member deactivated successfully" };
  }
}
