import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Application } from "../modules/applications/entities/application.entity";
import { UserApplication } from "../modules/applications/entities/user-application.entity";
import { RefreshToken } from "../modules/sessions/entities/refresh-token.entity";
import { Session } from "../modules/sessions/entities/session.entity";
import { User } from "../modules/users/entities/user.entity";

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: "mysql",
  host: configService.getOrThrow<string>("DB_HOST"),
  port: Number(configService.getOrThrow<number>("DB_PORT")),
  username: configService.getOrThrow<string>("DB_USERNAME"),
  password: configService.get<string>("DB_PASSWORD", ""),
  database: configService.getOrThrow<string>("DB_DATABASE"),
  entities: [User, Application, UserApplication, RefreshToken, Session],
  synchronize: false,
  logging: configService.get<boolean>("DB_LOGGING", false),
  migrationsRun: false,
});
