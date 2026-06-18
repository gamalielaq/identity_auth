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
import { UserApplicationRole } from "../../../common/enums/user-application-role.enum";
import { UserApplicationStatus } from "../../../common/enums/user-application-status.enum";
import { User } from "../../users/entities/user.entity";
import { Application } from "./application.entity";

@Entity("user_applications")
@Index("IDX_user_applications_user_application", ["userId", "applicationId"], {
  unique: true,
})
export class UserApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  userId!: string;

  @ManyToOne(() => User, (user) => user.applications, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
    foreignKeyConstraintName: "FK_user_applications_user",
  })
  user!: User;

  @Column({ name: "application_id", type: "varchar", length: 36 })
  applicationId!: string;

  @ManyToOne(() => Application, (application) => application.users, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "application_id",
    foreignKeyConstraintName: "FK_user_applications_application",
  })
  application!: Application;

  @Column({
    type: "enum",
    enum: UserApplicationRole,
    default: UserApplicationRole.OWNER,
  })
  role!: UserApplicationRole;

  @Column({
    type: "enum",
    enum: UserApplicationStatus,
    default: UserApplicationStatus.ACTIVE,
  })
  status!: UserApplicationStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
