import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Family } from "./entities/family.entity";
import { FamiliesController } from "./families.controller";
import { FamiliesService } from "./families.service";

@Module({
  imports: [TypeOrmModule.forFeature([Family])],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService],
})
export class FamiliesModule {}
