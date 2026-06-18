import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PasswordHashingService } from "../auth/password-hashing.service";
import { Application } from "./entities/application.entity";
import { UserApplication } from "./entities/user-application.entity";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";

@Module({
  imports: [TypeOrmModule.forFeature([Application, UserApplication])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PasswordHashingService],
  exports: [TypeOrmModule, ApplicationsService],
})
export class ApplicationsModule {}
