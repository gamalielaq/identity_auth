import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, MoreThan, Repository } from "typeorm";
import { FamilyMemberRole } from "../common/enums/family-member-role.enum";
import { Family } from "../families/entities/family.entity";
import { FamilyMember } from "../members/entities/family-member.entity";
import { MemberPin } from "../members/entities/member-pin.entity";
import { LoginRequestDto } from "./dto/requests/login-request.dto";
import { RefreshTokenRequestDto } from "./dto/requests/refresh-token-request.dto";
import { RegisterRequestDto } from "./dto/requests/register-request.dto";
import { RefreshToken } from "./entities/refresh-token.entity";
import { UserAccount } from "./entities/user-account.entity";
import { AuthJwtPayload } from "./interfaces/auth-jwt-payload.interface";
import { PasswordHashingService } from "./password-hashing.service";
import { RefreshTokenGeneratorService } from "./refresh-token-generator.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly passwordHashingService: PasswordHashingService,
    private readonly refreshTokenGeneratorService: RefreshTokenGeneratorService,
    @InjectRepository(UserAccount)
    private readonly userAccountsRepository: Repository<UserAccount>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async register(registerDto: RegisterRequestDto) {
    const email = registerDto.email.toLowerCase().trim();
    const existingAccount = await this.userAccountsRepository.findOne({
      where: { email },
    });

    if (existingAccount) {
      throw new ConflictException("Email is already registered");
    }

    const passwordHash = await this.passwordHashingService.hash(
      registerDto.password,
    );
    const pinHash = await this.passwordHashingService.hash(
      registerDto.adminPin,
    );

    const result = await this.dataSource.transaction(async (manager) => {
      const family = await manager.save(
        Family,
        manager.create(Family, { name: registerDto.familyName }),
      );
      const account = await manager.save(
        UserAccount,
        manager.create(UserAccount, {
          familyId: family.id,
          email,
          passwordHash,
          emailVerifiedAt: null,
          isActive: true,
          lastLoginAt: new Date(),
        }),
      );
      const member = await manager.save(
        FamilyMember,
        manager.create(FamilyMember, {
          familyId: family.id,
          name: registerDto.adminName,
          role: FamilyMemberRole.ADULT,
          avatarUrl: null,
          color: null,
          icon: null,
          isAdmin: true,
          isActive: true,
        }),
      );
      await manager.save(
        MemberPin,
        manager.create(MemberPin, {
          memberId: member.id,
          pinHash,
          failedAttempts: 0,
          lockedUntil: null,
        }),
      );

      return { family, account, member };
    });

    const tokens = await this.issueTokens({
      userAccountId: result.account.id,
      familyId: result.family.id,
      memberId: result.member.id,
    });

    return {
      family: result.family,
      account: this.serializeAccount(result.account),
      member: result.member,
      tokens,
    };
  }

  async login(loginDto: LoginRequestDto) {
    const email = loginDto.email.toLowerCase().trim();
    const account = await this.userAccountsRepository.findOne({
      where: { email, isActive: true },
      relations: { family: { members: true } },
    });

    if (!account) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await this.passwordHashingService.compare(
      loginDto.password,
      account.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    account.lastLoginAt = new Date();
    await this.userAccountsRepository.save(account);

    const tokens = await this.issueTokens({
      userAccountId: account.id,
      familyId: account.familyId,
    });

    return {
      family: account.family,
      members: account.family.members.filter((member) => member.isActive),
      tokens,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenRequestDto) {
    const tokenHash = this.refreshTokenGeneratorService.hash(
      refreshTokenDto.refreshToken,
    );
    const storedToken = await this.refreshTokensRepository.findOne({
      where: {
        tokenHash,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: { userAccount: true },
    });

    if (!storedToken || !storedToken.userAccount.isActive) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    storedToken.revokedAt = new Date();
    await this.refreshTokensRepository.save(storedToken);

    const tokens = await this.issueTokens({
      userAccountId: storedToken.userAccountId,
      familyId: storedToken.familyId,
      memberId: storedToken.memberId ?? undefined,
    });

    return { tokens };
  }

  async logout(refreshTokenDto: RefreshTokenRequestDto): Promise<void> {
    const tokenHash = this.refreshTokenGeneratorService.hash(
      refreshTokenDto.refreshToken,
    );
    const storedToken = await this.refreshTokensRepository.findOne({
      where: { tokenHash, revokedAt: IsNull() },
    });

    if (storedToken) {
      storedToken.revokedAt = new Date();
      await this.refreshTokensRepository.save(storedToken);
    }
  }

  private async issueTokens(params: {
    userAccountId: string;
    familyId: string;
    memberId?: string;
  }) {
    const payload: AuthJwtPayload = {
      sub: params.userAccountId,
      familyId: params.familyId,
      type: params.memberId ? "member_session" : "family_session",
      memberId: params.memberId,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get<string>(
        "JWT_ACCESS_EXPIRES_IN",
        "15m",
      ) as JwtSignOptions["expiresIn"],
    });
    const refreshToken = this.refreshTokenGeneratorService.generate();
    const refreshTokenHash =
      this.refreshTokenGeneratorService.hash(refreshToken);
    const expiresInDays = this.configService.get<number>(
      "REFRESH_TOKEN_EXPIRES_DAYS",
      30,
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        familyId: params.familyId,
        userAccountId: params.userAccountId,
        memberId: params.memberId ?? null,
        tokenHash: refreshTokenHash,
        expiresAt,
        revokedAt: null,
      }),
    );

    return { accessToken, refreshToken };
  }

  private serializeAccount(account: UserAccount) {
    return {
      id: account.id,
      email: account.email,
      emailVerified: Boolean(account.emailVerifiedAt),
    };
  }
}
