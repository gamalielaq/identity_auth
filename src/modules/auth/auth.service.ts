import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, MoreThan, Repository } from "typeorm";
import { ApplicationStatus } from "../../common/enums/application-status.enum";
import { UserApplicationRole } from "../../common/enums/user-application-role.enum";
import { UserApplicationStatus } from "../../common/enums/user-application-status.enum";
import { UserStatus } from "../../common/enums/user-status.enum";
import { Application } from "../applications/entities/application.entity";
import { UserApplication } from "../applications/entities/user-application.entity";
import { RefreshToken } from "../sessions/entities/refresh-token.entity";
import { Session } from "../sessions/entities/session.entity";
import { User } from "../users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
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
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    @InjectRepository(UserApplication)
    private readonly userApplicationsRepository: Repository<UserApplication>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
  ) {}

  async register(registerDto: RegisterDto, metadata?: RequestMetadata) {
    const email = registerDto.email.toLowerCase().trim();
    const application = await this.findActiveApplication(registerDto.clientId);
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      const existingAccess = await this.userApplicationsRepository.exists({
        where: { userId: existingUser.id, applicationId: application.id },
      });

      if (existingAccess) {
        throw new ConflictException(
          "User is already registered for this application",
        );
      }
    }

    const passwordHash = await this.passwordHashingService.hash(
      registerDto.password,
    );

    const result = await this.dataSource.transaction(async (manager) => {
      const user =
        existingUser ??
        (await manager.save(
          User,
          manager.create(User, {
            name: registerDto.name,
            email,
            passwordHash,
            emailVerified: false,
            status: UserStatus.ACTIVE,
          }),
        ));

      const userApplication = await manager.save(
        UserApplication,
        manager.create(UserApplication, {
          userId: user.id,
          applicationId: application.id,
          role: UserApplicationRole.OWNER,
          status: UserApplicationStatus.ACTIVE,
        }),
      );

      return { user, userApplication };
    });

    const tokens = await this.issueTokens({
      user: result.user,
      application,
      role: result.userApplication.role,
      metadata,
    });

    return {
      user: this.serializeUser(result.user),
      application: this.serializeApplication(application),
      role: result.userApplication.role,
      tokens,
    };
  }

  async login(loginDto: LoginDto, metadata?: RequestMetadata) {
    const email = loginDto.email.toLowerCase().trim();
    const application = await this.findActiveApplication(loginDto.clientId);
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await this.passwordHashingService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const userApplication = await this.userApplicationsRepository.findOne({
      where: {
        userId: user.id,
        applicationId: application.id,
        status: UserApplicationStatus.ACTIVE,
      },
    });

    if (!userApplication) {
      throw new ForbiddenException(
        "User does not have access to this application",
      );
    }

    const tokens = await this.issueTokens({
      user,
      application,
      role: userApplication.role,
      metadata,
    });

    return {
      user: this.serializeUser(user),
      application: this.serializeApplication(application),
      role: userApplication.role,
      tokens,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto, metadata?: RequestMetadata) {
    const tokenHash = this.refreshTokenGeneratorService.hash(
      refreshTokenDto.refreshToken,
    );
    const storedToken = await this.refreshTokensRepository.findOne({
      where: {
        tokenHash,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: { user: true, application: true },
    });

    if (
      !storedToken ||
      storedToken.user.status !== UserStatus.ACTIVE ||
      storedToken.application.status !== ApplicationStatus.ACTIVE
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userApplication = await this.userApplicationsRepository.findOne({
      where: {
        userId: storedToken.userId,
        applicationId: storedToken.applicationId,
        status: UserApplicationStatus.ACTIVE,
      },
    });

    if (!userApplication) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const revokedAt = new Date();
    storedToken.revokedAt = revokedAt;
    await this.refreshTokensRepository.save(storedToken);
    await this.sessionsRepository.update(
      { refreshTokenId: storedToken.id, revokedAt: IsNull() },
      { revokedAt },
    );

    const tokens = await this.issueTokens({
      user: storedToken.user,
      application: storedToken.application,
      role: userApplication.role,
      metadata,
    });

    return { tokens };
  }

  async logout(logoutDto: LogoutDto): Promise<void> {
    const tokenHash = this.refreshTokenGeneratorService.hash(
      logoutDto.refreshToken,
    );
    const storedToken = await this.refreshTokensRepository.findOne({
      where: { tokenHash, revokedAt: IsNull() },
    });

    if (!storedToken) {
      return;
    }

    const revokedAt = new Date();
    storedToken.revokedAt = revokedAt;
    await this.refreshTokensRepository.save(storedToken);
    await this.sessionsRepository.update(
      { refreshTokenId: storedToken.id, revokedAt: IsNull() },
      { revokedAt },
    );
  }

  me(payload: AuthJwtPayload) {
    return { data: payload };
  }

  private async findActiveApplication(clientId: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { clientId },
    });

    if (!application || application.status !== ApplicationStatus.ACTIVE) {
      throw new UnauthorizedException("Invalid application clientId");
    }

    return application;
  }

  private async issueTokens(params: {
    user: User;
    application: Application;
    role: UserApplicationRole;
    metadata?: RequestMetadata;
  }) {
    const payload: AuthJwtPayload = {
      sub: params.user.id,
      email: params.user.email,
      applicationId: params.application.id,
      clientId: params.application.clientId,
      role: params.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get<string>(
        "JWT_ACCESS_EXPIRES_IN",
        "15m",
      ) as JwtSignOptions["expiresIn"],
    });
    const refreshToken = this.refreshTokenGeneratorService.generate();
    const tokenHash = this.refreshTokenGeneratorService.hash(refreshToken);
    const expiresInDays = this.configService.get<number>(
      "REFRESH_TOKEN_EXPIRES_DAYS",
      30,
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const storedRefreshToken = await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        userId: params.user.id,
        applicationId: params.application.id,
        tokenHash,
        expiresAt,
        revokedAt: null,
      }),
    );

    await this.sessionsRepository.save(
      this.sessionsRepository.create({
        userId: params.user.id,
        applicationId: params.application.id,
        refreshTokenId: storedRefreshToken.id,
        ipAddress: params.metadata?.ipAddress ?? null,
        userAgent: params.metadata?.userAgent ?? null,
        revokedAt: null,
      }),
    );

    return { accessToken, refreshToken };
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      status: user.status,
    };
  }

  private serializeApplication(application: Application) {
    return {
      id: application.id,
      name: application.name,
      code: application.code,
      clientId: application.clientId,
      status: application.status,
    };
  }
}

export interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}
