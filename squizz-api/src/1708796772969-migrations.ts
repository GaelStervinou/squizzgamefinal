import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1708796772969 implements MigrationInterface {
    name = 'Migrations1708796772969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "duration" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "duration"`);
    }

}
