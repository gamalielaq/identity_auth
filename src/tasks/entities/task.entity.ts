import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DayOfWeek } from "../../common/enums/day-of-week.enum";
import { TaskRecurrenceType } from "../../common/enums/task-recurrence-type.enum";
import { TaskAssignment } from "../../task-assignments/entities/task-assignment.entity";
import { TaskCategory } from "../../task-categories/entities/task-category.entity";
import { TaskRotationMember } from "../../task-rotations/entities/task-rotation-member.entity";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "category_id", type: "varchar", length: 36, nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => TaskCategory, (category) => category.tasks, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "category_id" })
  category!: TaskCategory | null;

  @Column({ type: "varchar", length: 160 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    name: "recurrence_type",
    type: "enum",
    enum: TaskRecurrenceType,
    default: TaskRecurrenceType.WEEKLY,
  })
  recurrenceType!: TaskRecurrenceType;

  @Column({
    name: "day_of_week",
    type: "enum",
    enum: DayOfWeek,
    nullable: true,
  })
  dayOfWeek!: DayOfWeek | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => TaskRotationMember, (rotationMember) => rotationMember.task)
  rotationMembers!: TaskRotationMember[];

  @OneToMany(() => TaskAssignment, (assignment) => assignment.task)
  assignments!: TaskAssignment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
