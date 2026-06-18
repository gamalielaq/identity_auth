import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordHashingService } from "../auth/password-hashing.service";
import { ApplicationStatus } from "../../common/enums/application-status.enum";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { Application } from "./entities/application.entity";

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async create(dto: CreateApplicationDto): Promise<Application> {
    const existing = await this.applicationsRepository.findOne({
      where: [{ code: dto.code }, { clientId: dto.clientId }],
    });

    if (existing) {
      throw new ConflictException(
        "Application code or clientId already exists",
      );
    }

    const clientSecretHash = dto.clientSecret
      ? await this.passwordHashingService.hash(dto.clientSecret)
      : null;

    const application = this.applicationsRepository.create({
      name: dto.name,
      code: dto.code,
      clientId: dto.clientId,
      clientSecretHash,
      status: ApplicationStatus.ACTIVE,
    });

    return this.applicationsRepository.save(application);
  }

  findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({ order: { createdAt: "DESC" } });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException(`Application with id ${id} was not found`);
    }
    return application;
  }
}
