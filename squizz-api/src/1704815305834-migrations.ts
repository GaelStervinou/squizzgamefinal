import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1704815305834 implements MigrationInterface {
    name = 'Migrations1704815305834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quizz" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "authorId" integer, CONSTRAINT "UQ_82ac2a314683624531a471d30c0" UNIQUE ("title"), CONSTRAINT "PK_6fbd9c6f5884207789cd89e8d00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_4d45442a2bd95954829c3b72127" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_4d45442a2bd95954829c3b72127"`);
        await queryRunner.query(`DROP TABLE "quizz"`);
    }

}
