import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FamilyMember } from "./entities/family-member.entity";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";

@Module({
  imports: [TypeOrmModule.forFeature([FamilyMember])],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
