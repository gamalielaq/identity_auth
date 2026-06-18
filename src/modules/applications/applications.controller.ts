import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    const data = await this.applicationsService.create(createApplicationDto);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.applicationsService.findAll();
    return { data };
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const data = await this.applicationsService.findOne(id);
    return { data };
  }
}
