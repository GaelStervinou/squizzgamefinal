import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1708852837757 implements MigrationInterface {
    name = 'Migrations1708852837757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "timeLimit"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "timeLimit" integer NOT NULL DEFAULT '900'`);
    }

}
