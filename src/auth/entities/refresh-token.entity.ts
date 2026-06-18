import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Family } from "../../families/entities/family.entity";
import { FamilyMember } from "../../members/entities/family-member.entity";
import { UserAccount } from "./user-account.entity";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "family_id", type: "varchar", length: 36 })
  familyId!: string;

  @ManyToOne(() => Family, (family) => family.refreshTokens, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "family_id",
    foreignKeyConstraintName: "FK_refresh_tokens_family",
  })
  family!: Family;

  @Column({ name: "user_account_id", type: "varchar", length: 36 })
  userAccountId!: string;

  @ManyToOne(() => UserAccount, (account) => account.refreshTokens, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_account_id",
    foreignKeyConstraintName: "FK_refresh_tokens_user_account",
  })
  userAccount!: UserAccount;

  @Column({ name: "member_id", type: "varchar", length: 36, nullable: true })
  memberId!: string | null;

  @ManyToOne(() => FamilyMember, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({
    name: "member_id",
    foreignKeyConstraintName: "FK_refresh_tokens_member",
  })
  member!: FamilyMember | null;

  @Column({ name: "token_hash", type: "varchar", length: 255 })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt!: Date;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
