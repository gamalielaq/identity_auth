import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TaskAssignmentStatus } from "../../common/enums/task-assignment-status.enum";
import { FamilyMember } from "../../members/entities/family-member.entity";
import { TaskAssignment } from "./task-assignment.entity";

@Entity("task_assignment_logs")
export class TaskAssignmentLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "assignment_id", type: "varchar", length: 36 })
  assignmentId!: string;

  @ManyToOne(() => TaskAssignment, (assignment) => assignment.logs, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "assignment_id" })
  assignment!: TaskAssignment;

  @Column({
    name: "changed_by_member_id",
    type: "varchar",
    length: 36,
    nullable: true,
  })
  changedByMemberId!: string | null;

  @ManyToOne(() => FamilyMember, (member) => member.assignmentLogs, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({
    name: "changed_by_member_id",
    foreignKeyConstraintName: "FK_task_assignment_logs_changed_by_member",
  })
  changedByMember!: FamilyMember | null;

  @Column({
    name: "from_status",
    type: "enum",
    enum: TaskAssignmentStatus,
    nullable: true,
  })
  fromStatus!: TaskAssignmentStatus | null;

  @Column({
    name: "to_status",
    type: "enum",
    enum: TaskAssignmentStatus,
  })
  toStatus!: TaskAssignmentStatus;

  @Column({ type: "text", nullable: true })
  message!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
