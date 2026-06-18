import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Family } from "./entities/family.entity";

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familiesRepository: Repository<Family>,
  ) {}

  async findOne(id: string): Promise<Family> {
    const family = await this.familiesRepository.findOne({ where: { id } });

    if (!family) {
      throw new NotFoundException(`Family with id ${id} was not found`);
    }

    return family;
  }
}
