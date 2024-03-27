import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1711272158259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("Creating tables");
    await queryRunner.query(
      `CREATE TABLE "users" (
                "id" SERIAL NOT NULL, 
                "telegramId" integer NOT NULL,
                "isMentor" boolean NOT NULL, 
                "profile" jsonb NOT NULL DEFAULT '{}', 
                CONSTRAINT "PK_cace4a159ff9f2512dd42373761" PRIMARY KEY ("id")
                )`
    );
    await queryRunner.query(
      `CREATE TABLE "whitelisted_mentors" (
                "id" SERIAL NOT NULL
                )`
    );
    await queryRunner.query(
      `CREATE TABLE "links" (
                "id" SERIAL NOT NULL, 
                "userId" integer NOT NULL, 
                "mentorId" integer NOT NULL, 
                "isAccepted" boolean NOT NULL, 
                CONSTRAINT "PK_4c4e4d8f3a2f6b8b1d8b5f7d7c4" PRIMARY KEY ("id")
                )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "whitelisted_mentors"`);
    await queryRunner.query(`DROP TABLE "links"`);
  }
}
