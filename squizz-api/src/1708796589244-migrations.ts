import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1708796589244 implements MigrationInterface {
    name = 'Migrations1708796589244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" ADD "randomizeQuestions" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP COLUMN "randomizeQuestions"`);
    }

}
