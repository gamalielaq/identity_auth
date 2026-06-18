import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "../applications/entities/application.entity";
import { UserApplication } from "../applications/entities/user-application.entity";
import { RefreshToken } from "../sessions/entities/refresh-token.entity";
import { Session } from "../sessions/entities/session.entity";
import { User } from "../users/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PasswordHashingService } from "./password-hashing.service";
import { RefreshTokenGeneratorService } from "./refresh-token-generator.service";

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User,
      Application,
      UserApplication,
      RefreshToken,
      Session,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    PasswordHashingService,
    RefreshTokenGeneratorService,
  ],
  exports: [AuthService, JwtAuthGuard, PasswordHashingService],
})
export class AuthModule {}
