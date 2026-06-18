import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FamilyMember } from "../../members/entities/family-member.entity";
import { Task } from "../../tasks/entities/task.entity";

@Entity("task_rotation_members")
@Index("IDX_task_rotation_members_task_member", ["taskId", "memberId"], {
  unique: true,
})
@Index(["taskId", "position"], { unique: true })
export class TaskRotationMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "task_id", type: "varchar", length: 36 })
  taskId!: string;

  @ManyToOne(() => Task, (task) => task.rotationMembers, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @Column({ name: "member_id", type: "varchar", length: 36 })
  memberId!: string;

  @ManyToOne(() => FamilyMember, (member) => member.rotationMemberships, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "member_id",
    foreignKeyConstraintName: "FK_task_rotation_members_member",
  })
  member!: FamilyMember;

  @Column({ type: "int" })
  position!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
