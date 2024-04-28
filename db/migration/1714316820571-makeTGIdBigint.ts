import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeTGIdBigint1714316820571 implements MigrationInterface {
  // Make tgID bigint
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                ALTER TABLE "users"
                ALTER COLUMN "telegramId" TYPE bigint
                `);
    await queryRunner.query(`
                ALTER TABLE "ongoing_commands"
                ALTER COLUMN "userId" TYPE bigint
                `);
    await queryRunner.query(`
                ALTER TABLE "ongoing_commands"
                ALTER COLUMN "chatId" TYPE bigint
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                ALTER TABLE "users"
                ALTER COLUMN "telegramId" TYPE integer
                `);
    await queryRunner.query(`
                ALTER TABLE "ongoing_commands"
                ALTER COLUMN "userId" TYPE integer
                `);
    await queryRunner.query(`
                ALTER TABLE "ongoing_commands"
                ALTER COLUMN "chatId" TYPE integer
                `);
  }
}
