import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1704908809160 implements MigrationInterface {
    name = 'Migrations1704908809160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "answer" character varying NOT NULL, "isCorrect" boolean NOT NULL, "questionId" integer, CONSTRAINT "UQ_cdc2bc47fcfbe99a3a3fdee1734" UNIQUE ("answer", "questionId"), CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cdc2bc47fcfbe99a3a3fdee173" ON "answer" ("answer", "questionId") `);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "quizzId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizz_option" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "value" character varying NOT NULL, "quizzId" integer, CONSTRAINT "PK_14af021af2a547886d392220203" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_student" ("id" SERIAL NOT NULL, "clientId" character varying NOT NULL, "studentId" integer, "roomId" integer, CONSTRAINT "UQ_3b7c0a23191c5c2728194165c24" UNIQUE ("clientId"), CONSTRAINT "PK_b4795f50148d16d16ad3f2b7e5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "password" character varying, "userLimit" integer NOT NULL, "timeLimit" integer NOT NULL DEFAULT '900', "isStarted" boolean NOT NULL DEFAULT false, "ownerId" integer, "quizzId" integer, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id")); COMMENT ON COLUMN "room"."timeLimit" IS 'Time limit in seconds'`);
        await queryRunner.query(`CREATE TABLE "quizz" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "authorId" integer, CONSTRAINT "UQ_82ac2a314683624531a471d30c0" UNIQUE ("title"), CONSTRAINT "PK_6fbd9c6f5884207789cd89e8d00" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_354e21261519e8abbd5cff8b438" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz_option" ADD CONSTRAINT "FK_fae8f341514d23e21c78fd13e2f" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_student" ADD CONSTRAINT "FK_03cb934713e81a04b1aa814341f" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_student" ADD CONSTRAINT "FK_ea1027ea85f0e0d8c6fe108db37" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_8c9a987162be68f5288c6c6b36e" FOREIGN KEY ("quizzId") REFERENCES "quizz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizz" ADD CONSTRAINT "FK_4d45442a2bd95954829c3b72127" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizz" DROP CONSTRAINT "FK_4d45442a2bd95954829c3b72127"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_8c9a987162be68f5288c6c6b36e"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`);
        await queryRunner.query(`ALTER TABLE "room_student" DROP CONSTRAINT "FK_ea1027ea85f0e0d8c6fe108db37"`);
        await queryRunner.query(`ALTER TABLE "room_student" DROP CONSTRAINT "FK_03cb934713e81a04b1aa814341f"`);
        await queryRunner.query(`ALTER TABLE "quizz_option" DROP CONSTRAINT "FK_fae8f341514d23e21c78fd13e2f"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_354e21261519e8abbd5cff8b438"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "quizz"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "room_student"`);
        await queryRunner.query(`DROP TABLE "quizz_option"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdc2bc47fcfbe99a3a3fdee173"`);
        await queryRunner.query(`DROP TABLE "answer"`);
    }

}
