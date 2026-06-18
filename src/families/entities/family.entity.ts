import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserAccount } from "../../auth/entities/user-account.entity";
import { RefreshToken } from "../../auth/entities/refresh-token.entity";
import { FamilyMember } from "../../members/entities/family-member.entity";

@Entity("families")
export class Family {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 160 })
  name!: string;

  @OneToMany(() => UserAccount, (account) => account.family)
  userAccounts!: UserAccount[];

  @OneToMany(() => FamilyMember, (member) => member.family)
  members!: FamilyMember[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.family)
  refreshTokens!: RefreshToken[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
