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
import { Session } from "./session.entity";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "FK_refresh_tokens_user",
  })
  user!: User;

  @Column({ name: "application_id", type: "varchar", length: 36 })
  applicationId!: string;

  @ManyToOne(() => Application, (application) => application.refreshTokens, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "application_id",
    foreignKeyConstraintName: "FK_refresh_tokens_application",
  })
  application!: Application;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt!: Date;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revokedAt!: Date | null;

  @OneToOne(() => Session, (session) => session.refreshToken)
  session!: Session;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
