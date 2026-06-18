import "dotenv/config";
import { DataSource } from "typeorm";

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.DB_LOGGING === "true",
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
});
