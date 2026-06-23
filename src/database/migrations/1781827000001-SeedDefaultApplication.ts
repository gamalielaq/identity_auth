import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDefaultApplication1781827000001 implements MigrationInterface {
  name = "SeedDefaultApplication1781827000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO \`applications\` (\`id\`, \`name\`, \`code\`, \`client_id\`, \`client_secret_hash\`, \`status\`, \`created_at\`, \`updated_at\`)
       VALUES (UUID(), 'Identity Web', 'identity-web', 'identity-web', NULL, 'active', NOW(), NOW())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`applications\` WHERE \`client_id\` = 'identity-web'`,
    );
  }
}
