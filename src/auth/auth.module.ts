import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Family } from "../families/entities/family.entity";
import { FamilyMember } from "../members/entities/family-member.entity";
import { MemberPin } from "../members/entities/member-pin.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshToken } from "./entities/refresh-token.entity";
import { UserAccount } from "./entities/user-account.entity";
import { PasswordHashingService } from "./password-hashing.service";
import { RefreshTokenGeneratorService } from "./refresh-token-generator.service";

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      Family,
      UserAccount,
      RefreshToken,
      FamilyMember,
      MemberPin,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHashingService,
    RefreshTokenGeneratorService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
