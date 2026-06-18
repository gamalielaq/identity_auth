import "dotenv/config";
import { DataSource } from "typeorm";
import { Application } from "../modules/applications/entities/application.entity";
import { UserApplication } from "../modules/applications/entities/user-application.entity";
import { RefreshToken } from "../modules/sessions/entities/refresh-token.entity";
import { Session } from "../modules/sessions/entities/session.entity";
import { User } from "../modules/users/entities/user.entity";

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.DB_LOGGING === "true",
  entities: [User, Application, UserApplication, RefreshToken, Session],
  migrations: ["src/database/migrations/*.ts"],
});
