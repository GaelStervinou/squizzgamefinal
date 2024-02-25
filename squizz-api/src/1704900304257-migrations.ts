import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1704900304257 implements MigrationInterface {
    name = 'Migrations1704900304257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "room"."timeLimit" IS 'Time limit in seconds'`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "timeLimit" SET DEFAULT '900'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "timeLimit" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "room"."timeLimit" IS NULL`);
    }

}
