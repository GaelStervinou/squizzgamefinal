import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1704880738357 implements MigrationInterface {
    name = 'Migrations1704880738357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quizz_option" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "value" character varying NOT NULL, "quizzId" integer, CONSTRAINT "PK_14af021af2a547886d392220203" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "password" character varying NOT NULL, "userLimit" integer NOT NULL, "ownerId" integer, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quizz_option" ADD CONSTRAINT "FK_fae8f341514d23e21c78fd13e2f" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`);
        await queryRunner.query(`ALTER TABLE "quizz_option" DROP CONSTRAINT "FK_fae8f341514d23e21c78fd13e2f"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "quizz_option"`);
    }

}
