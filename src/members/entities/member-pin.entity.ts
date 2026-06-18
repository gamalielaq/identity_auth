import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FamilyMember } from "./family-member.entity";

@Entity("member_pins")
@Index("REL_70f230faae9a4f34a9af400c33", ["memberId"], { unique: true })
export class MemberPin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "member_id", type: "varchar", length: 36 })
  memberId!: string;

  @OneToOne(() => FamilyMember, (member) => member.pin, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "member_id",
    foreignKeyConstraintName: "FK_member_pins_member",
  })
  member!: FamilyMember;

  @Column({ name: "pin_hash", type: "varchar", length: 255 })
  pinHash!: string;

  @Column({ name: "failed_attempts", type: "int", default: 0 })
  failedAttempts!: number;

  @Column({ name: "locked_until", type: "timestamp", nullable: true })
  lockedUntil!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
