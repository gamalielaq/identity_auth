import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FamilyMemberRole } from "../../common/enums/family-member-role.enum";
import { Family } from "../../families/entities/family.entity";
import { TaskAssignmentLog } from "../../task-assignments/entities/task-assignment-log.entity";
import { TaskAssignment } from "../../task-assignments/entities/task-assignment.entity";
import { TaskRotationMember } from "../../task-rotations/entities/task-rotation-member.entity";
import { MemberPin } from "./member-pin.entity";

@Entity("family_members")
export class FamilyMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "family_id", type: "varchar", length: 36 })
  familyId!: string;

  @ManyToOne(() => Family, (family) => family.members, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "family_id",
    foreignKeyConstraintName: "FK_family_members_family",
  })
  family!: Family;

  @Column({ type: "varchar", length: 120 })
  name!: string;

  @Column({
    type: "enum",
    enum: FamilyMemberRole,
    default: FamilyMemberRole.ADULT,
  })
  role!: FamilyMemberRole;

  @Column({ name: "avatar_url", type: "varchar", length: 500, nullable: true })
  avatarUrl!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  color!: string | null;

  @Column({ type: "varchar", length: 80, nullable: true })
  icon!: string | null;

  @Column({ name: "is_admin", type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(
    () => TaskRotationMember,
    (rotationMember) => rotationMember.member,
  )
  rotationMemberships!: TaskRotationMember[];

  @OneToMany(() => TaskAssignment, (assignment) => assignment.assignedMember)
  assignments!: TaskAssignment[];

  @OneToMany(() => TaskAssignmentLog, (log) => log.changedByMember)
  assignmentLogs!: TaskAssignmentLog[];

  @OneToOne(() => MemberPin, (pin) => pin.member)
  pin!: MemberPin;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
