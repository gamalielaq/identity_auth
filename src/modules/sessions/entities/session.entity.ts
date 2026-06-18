import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Application } from "../../applications/entities/application.entity";
import { User } from "../../users/entities/user.entity";
import { RefreshToken } from "./refresh-token.entity";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id", foreignKeyConstraintName: "FK_sessions_user" })
  user!: User;

  @Column({ name: "application_id", type: "varchar", length: 36 })
  applicationId!: string;

  @ManyToOne(() => Application, (application) => application.sessions, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "application_id",
    foreignKeyConstraintName: "FK_sessions_application",
  })
  application!: Application;

  @Column({ name: "refresh_token_id", type: "varchar", length: 36 })
  refreshTokenId!: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.session, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "refresh_token_id",
    foreignKeyConstraintName: "FK_sessions_refresh_token",
  })
  refreshToken!: RefreshToken;

  @Column({ name: "ip_address", type: "varchar", length: 80, nullable: true })
  ipAddress!: string | null;

  @Column({ name: "user_agent", type: "varchar", length: 500, nullable: true })
  userAgent!: string | null;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
