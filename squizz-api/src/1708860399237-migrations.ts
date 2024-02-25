import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1708860399237 implements MigrationInterface {
    name = 'Migrations1708860399237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student_answer" ("id" SERIAL NOT NULL, "questionId" integer, "answerId" integer, "userId" integer, "roomId" integer, CONSTRAINT "UQ_0455b33e11cbc22428093a72406" UNIQUE ("questionId", "roomId", "userId"), CONSTRAINT "PK_376adcf5739803c71c22eece43b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0455b33e11cbc22428093a7240" ON "student_answer" ("questionId", "roomId", "userId") `);
        await queryRunner.query(`ALTER TABLE "student_answer" ADD CONSTRAINT "FK_d1b9efd6286e9c05ed43cf28ae4" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_answer" ADD CONSTRAINT "FK_d831458b7821315bd808489e2d9" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_answer" ADD CONSTRAINT "FK_a54477c60507455e2937faa17b0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_answer" ADD CONSTRAINT "FK_f8a213c055dc5f2f5b1f6c18294" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_answer" DROP CONSTRAINT "FK_f8a213c055dc5f2f5b1f6c18294"`);
        await queryRunner.query(`ALTER TABLE "student_answer" DROP CONSTRAINT "FK_a54477c60507455e2937faa17b0"`);
        await queryRunner.query(`ALTER TABLE "student_answer" DROP CONSTRAINT "FK_d831458b7821315bd808489e2d9"`);
        await queryRunner.query(`ALTER TABLE "student_answer" DROP CONSTRAINT "FK_d1b9efd6286e9c05ed43cf28ae4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0455b33e11cbc22428093a7240"`);
        await queryRunner.query(`DROP TABLE "student_answer"`);
    }

}
