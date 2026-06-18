import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFamilyAuthSchema1781815000000 implements MigrationInterface {
  name = "AddFamilyAuthSchema1781815000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`families\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(160) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD \`family_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD \`role\` enum ('adult', 'child') NOT NULL DEFAULT 'adult'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD \`avatar_url\` varchar(500) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD \`color\` varchar(20) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD \`icon\` varchar(80) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD \`is_admin\` tinyint NOT NULL DEFAULT 0`,
    );

    await queryRunner.query(
      `INSERT INTO \`families\` (\`id\`, \`name\`, \`created_at\`, \`updated_at\`)
       SELECT UUID(), 'Default Family', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6)
       WHERE EXISTS (SELECT 1 FROM \`family_members\`)
       AND NOT EXISTS (SELECT 1 FROM \`families\`)`,
    );
    await queryRunner.query(
      `UPDATE \`family_members\`
       SET \`family_id\` = (SELECT \`id\` FROM \`families\` ORDER BY \`created_at\` ASC LIMIT 1)
       WHERE \`family_id\` IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` MODIFY \`family_id\` varchar(36) NOT NULL`,
    );

    await queryRunner.query(
      `CREATE TABLE \`user_accounts\` (\`id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`email\` varchar(180) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`email_verified_at\` timestamp NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`last_login_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_user_accounts_email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`member_pins\` (\`id\` varchar(36) NOT NULL, \`member_id\` varchar(36) NOT NULL, \`pin_hash\` varchar(255) NOT NULL, \`failed_attempts\` int NOT NULL DEFAULT 0, \`locked_until\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_70f230faae9a4f34a9af400c33\` (\`member_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`family_id\` varchar(36) NOT NULL, \`user_account_id\` varchar(36) NOT NULL, \`member_id\` varchar(36) NULL, \`token_hash\` varchar(255) NOT NULL, \`expires_at\` timestamp NOT NULL, \`revoked_at\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`family_members\` ADD CONSTRAINT \`FK_family_members_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_accounts\` ADD CONSTRAINT \`FK_user_accounts_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`member_pins\` ADD CONSTRAINT \`FK_member_pins_member\` FOREIGN KEY (\`member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_refresh_tokens_family\` FOREIGN KEY (\`family_id\`) REFERENCES \`families\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_refresh_tokens_user_account\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_accounts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_refresh_tokens_member\` FOREIGN KEY (\`member_id\`) REFERENCES \`family_members\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_refresh_tokens_member\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_refresh_tokens_user_account\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_refresh_tokens_family\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`member_pins\` DROP FOREIGN KEY \`FK_member_pins_member\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_accounts\` DROP FOREIGN KEY \`FK_user_accounts_family\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP FOREIGN KEY \`FK_family_members_family\``,
    );

    await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    await queryRunner.query(
      `DROP INDEX \`REL_70f230faae9a4f34a9af400c33\` ON \`member_pins\``,
    );
    await queryRunner.query(`DROP TABLE \`member_pins\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_user_accounts_email\` ON \`user_accounts\``,
    );
    await queryRunner.query(`DROP TABLE \`user_accounts\``);

    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP COLUMN \`is_admin\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP COLUMN \`icon\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP COLUMN \`color\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP COLUMN \`avatar_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP COLUMN \`role\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`family_members\` DROP COLUMN \`family_id\``,
    );
    await queryRunner.query(`DROP TABLE \`families\``);
  }
}
