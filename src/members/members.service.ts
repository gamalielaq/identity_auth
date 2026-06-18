import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { FamilyMember } from "./entities/family-member.entity";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly membersRepository: Repository<FamilyMember>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<FamilyMember> {
    const member = this.membersRepository.create(createMemberDto);
    return this.membersRepository.save(member);
  }

  findAll(): Promise<FamilyMember[]> {
    return this.membersRepository.find({
      order: { name: "ASC" },
    });
  }

  async findOne(id: string): Promise<FamilyMember> {
    const member = await this.membersRepository.findOne({ where: { id } });

    if (!member) {
      throw new NotFoundException(`Member with id ${id} was not found`);
    }

    return member;
  }

  async update(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<FamilyMember> {
    const member = await this.findOne(id);
    Object.assign(member, updateMemberDto);

    return this.membersRepository.save(member);
  }

  async remove(id: string): Promise<FamilyMember> {
    const member = await this.findOne(id);
    member.isActive = false;

    return this.membersRepository.save(member);
  }
}
