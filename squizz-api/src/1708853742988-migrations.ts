import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1708853742988 implements MigrationInterface {
    name = 'Migrations1708853742988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "isEnded" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "isEnded"`);
    }

}
