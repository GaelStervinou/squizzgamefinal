import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1704820060046 implements MigrationInterface {
    name = 'Migrations1704820060046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD "description" character varying NOT NULL`);
    }

}
