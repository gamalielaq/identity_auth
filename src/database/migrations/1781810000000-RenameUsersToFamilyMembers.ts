import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUsersToFamilyMembers1781810000000 implements MigrationInterface {
  name = "RenameUsersToFamilyMembers1781810000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `task_rotation_members` DROP FOREIGN KEY `FK_a5caa0b57a2421b38db3b71b4f6`",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignments` DROP FOREIGN KEY `FK_facc9df6e01ee22df54c4a2376a`",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignment_logs` DROP FOREIGN KEY `FK_64b1ee0f745d4c417108b00c43e`",
    );

    await queryRunner.query(
      "DROP INDEX `IDX_ede8d8903776257e89235a68bf` ON `task_rotation_members`",
    );
    await queryRunner.query(
      "DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`",
    );

    await queryRunner.query("RENAME TABLE `users` TO `family_members`");
    await queryRunner.query("ALTER TABLE `family_members` DROP COLUMN `email`");

    await queryRunner.query(
      "ALTER TABLE `task_rotation_members` CHANGE `user_id` `member_id` varchar(36) NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignments` CHANGE `assigned_user_id` `assigned_member_id` varchar(36) NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignment_logs` CHANGE `changed_by_user_id` `changed_by_member_id` varchar(36) NULL",
    );

    await queryRunner.query(
      "CREATE UNIQUE INDEX `IDX_task_rotation_members_task_member` ON `task_rotation_members` (`task_id`, `member_id`)",
    );

    await queryRunner.query(
      "ALTER TABLE `task_rotation_members` ADD CONSTRAINT `FK_task_rotation_members_member` FOREIGN KEY (`member_id`) REFERENCES `family_members`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignments` ADD CONSTRAINT `FK_task_assignments_assigned_member` FOREIGN KEY (`assigned_member_id`) REFERENCES `family_members`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignment_logs` ADD CONSTRAINT `FK_task_assignment_logs_changed_by_member` FOREIGN KEY (`changed_by_member_id`) REFERENCES `family_members`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `task_assignment_logs` DROP FOREIGN KEY `FK_task_assignment_logs_changed_by_member`",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignments` DROP FOREIGN KEY `FK_task_assignments_assigned_member`",
    );
    await queryRunner.query(
      "ALTER TABLE `task_rotation_members` DROP FOREIGN KEY `FK_task_rotation_members_member`",
    );

    await queryRunner.query(
      "DROP INDEX `IDX_task_rotation_members_task_member` ON `task_rotation_members`",
    );

    await queryRunner.query(
      "ALTER TABLE `task_assignment_logs` CHANGE `changed_by_member_id` `changed_by_user_id` varchar(36) NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignments` CHANGE `assigned_member_id` `assigned_user_id` varchar(36) NOT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `task_rotation_members` CHANGE `member_id` `user_id` varchar(36) NOT NULL",
    );

    await queryRunner.query(
      "ALTER TABLE `family_members` ADD `email` varchar(180) NULL",
    );
    await queryRunner.query("RENAME TABLE `family_members` TO `users`");

    await queryRunner.query(
      "CREATE UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users` (`email`)",
    );
    await queryRunner.query(
      "CREATE UNIQUE INDEX `IDX_ede8d8903776257e89235a68bf` ON `task_rotation_members` (`task_id`, `user_id`)",
    );

    await queryRunner.query(
      "ALTER TABLE `task_assignment_logs` ADD CONSTRAINT `FK_64b1ee0f745d4c417108b00c43e` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `task_assignments` ADD CONSTRAINT `FK_facc9df6e01ee22df54c4a2376a` FOREIGN KEY (`assigned_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `task_rotation_members` ADD CONSTRAINT `FK_a5caa0b57a2421b38db3b71b4f6` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
  }
}
