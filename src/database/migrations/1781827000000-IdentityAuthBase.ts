import { MigrationInterface, QueryRunner } from "typeorm";

export class IdentityAuthBase1781827000000 implements MigrationInterface {
  name = "IdentityAuthBase1781827000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryRunner.query("DROP TABLE IF EXISTS `task_assignment_logs`");
    await queryRunner.query("DROP TABLE IF EXISTS `task_assignments`");
    await queryRunner.query("DROP TABLE IF EXISTS `task_rotation_members`");
    await queryRunner.query("DROP TABLE IF EXISTS `tasks`");
    await queryRunner.query("DROP TABLE IF EXISTS `task_categories`");
    await queryRunner.query("DROP TABLE IF EXISTS `member_pins`");
    await queryRunner.query("DROP TABLE IF EXISTS `family_members`");
    await queryRunner.query("DROP TABLE IF EXISTS `families`");
    await queryRunner.query("DROP TABLE IF EXISTS `sessions`");
    await queryRunner.query("DROP TABLE IF EXISTS `refresh_tokens`");
    await queryRunner.query("DROP TABLE IF EXISTS `user_applications`");
    await queryRunner.query("DROP TABLE IF EXISTS `applications`");
    await queryRunner.query("DROP TABLE IF EXISTS `user_accounts`");
    await queryRunner.query("DROP TABLE IF EXISTS `users`");
    await queryRunner.query("SET FOREIGN_KEY_CHECKS = 1");

    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(120) NOT NULL, \`email\` varchar(180) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`email_verified\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_users_email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`applications\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(120) NOT NULL, \`code\` varchar(80) NOT NULL, \`client_id\` varchar(120) NOT NULL, \`client_secret_hash\` varchar(255) NULL, \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_applications_code\` (\`code\`), UNIQUE INDEX \`IDX_applications_client_id\` (\`client_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_applications\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`application_id\` varchar(36) NOT NULL, \`role\` enum ('owner', 'admin', 'member') NOT NULL DEFAULT 'owner', \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_user_applications_user_application\` (\`user_id\`, \`application_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`application_id\` varchar(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` timestamp NOT NULL, \`revoked_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sessions\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(36) NOT NULL, \`application_id\` varchar(36) NOT NULL, \`refresh_token_id\` varchar(36) NOT NULL, \`ip_address\` varchar(80) NULL, \`user_agent\` varchar(500) NULL, \`revoked_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_50616a15369732b517cce2720a\` (\`refresh_token_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      "ALTER TABLE `user_applications` ADD CONSTRAINT `FK_user_applications_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `user_applications` ADD CONSTRAINT `FK_user_applications_application` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `refresh_tokens` ADD CONSTRAINT `FK_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `refresh_tokens` ADD CONSTRAINT `FK_refresh_tokens_application` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `sessions` ADD CONSTRAINT `FK_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `sessions` ADD CONSTRAINT `FK_sessions_application` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `sessions` ADD CONSTRAINT `FK_sessions_refresh_token` FOREIGN KEY (`refresh_token_id`) REFERENCES `refresh_tokens`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `sessions` DROP FOREIGN KEY `FK_sessions_refresh_token`",
    );
    await queryRunner.query(
      "ALTER TABLE `sessions` DROP FOREIGN KEY `FK_sessions_application`",
    );
    await queryRunner.query(
      "ALTER TABLE `sessions` DROP FOREIGN KEY `FK_sessions_user`",
    );
    await queryRunner.query(
      "ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `FK_refresh_tokens_application`",
    );
    await queryRunner.query(
      "ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `FK_refresh_tokens_user`",
    );
    await queryRunner.query(
      "ALTER TABLE `user_applications` DROP FOREIGN KEY `FK_user_applications_application`",
    );
    await queryRunner.query(
      "ALTER TABLE `user_applications` DROP FOREIGN KEY `FK_user_applications_user`",
    );
    await queryRunner.query("DROP TABLE `sessions`");
    await queryRunner.query("DROP TABLE `refresh_tokens`");
    await queryRunner.query("DROP TABLE `user_applications`");
    await queryRunner.query("DROP TABLE `applications`");
    await queryRunner.query("DROP TABLE `users`");
  }
}
