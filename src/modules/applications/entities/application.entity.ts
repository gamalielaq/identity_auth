import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApplicationStatus } from "../../../common/enums/application-status.enum";
import { RefreshToken } from "../../sessions/entities/refresh-token.entity";
import { Session } from "../../sessions/entities/session.entity";
import { UserApplication } from "./user-application.entity";

@Entity("applications")
@Index("IDX_applications_code", ["code"], { unique: true })
@Index("IDX_applications_client_id", ["clientId"], { unique: true })
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({ type: "varchar", length: 80 })
  code!: string;

  @Column({ name: "client_id", type: "varchar", length: 120 })
  clientId!: string;

  @Column({
    name: "client_secret_hash",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  clientSecretHash!: string | null;

  @Column({
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.ACTIVE,
  })
  status!: ApplicationStatus;

  @OneToMany(
    () => UserApplication,
    (userApplication) => userApplication.application,
  )
  users!: UserApplication[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.application)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => Session, (session) => session.application)
  sessions!: Session[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
