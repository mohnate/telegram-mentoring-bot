import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOngoingCommands1711279564951 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE ongoing_commands (
          "id" SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL,
          "stepId" INTEGER NOT NULL,
          "command" TEXT NOT NULL,
          "chatId" INTEGER NOT NULL
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE ongoing_commands;
      `);
  }
}
