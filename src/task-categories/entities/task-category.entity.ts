import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Task } from "../../tasks/entities/task.entity";

@Entity("task_categories")
export class TaskCategory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @OneToMany(() => Task, (task) => task.category)
  tasks!: Task[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
