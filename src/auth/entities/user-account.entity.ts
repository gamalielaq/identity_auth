import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Family } from "../../families/entities/family.entity";
import { RefreshToken } from "./refresh-token.entity";

@Entity("user_accounts")
@Index("IDX_user_accounts_email", ["email"], { unique: true })
export class UserAccount {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "family_id", type: "varchar", length: 36 })
  familyId!: string;

  @ManyToOne(() => Family, (family) => family.userAccounts, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "family_id",
    foreignKeyConstraintName: "FK_user_accounts_family",
  })
  family!: Family;

  @Column({ type: "varchar", length: 180 })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ name: "email_verified_at", type: "timestamp", nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt!: Date | null;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.userAccount)
  refreshTokens!: RefreshToken[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
