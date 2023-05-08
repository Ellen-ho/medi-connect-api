import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTableNameOfAnswerAppreciation1683535685070 implements MigrationInterface {
    name = 'ModifyTableNameOfAnswerAppreciation1683535685070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer_appreciations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid, "answer_id" uuid, CONSTRAINT "PK_0eabd4be72db946e47911c40e03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" ADD CONSTRAINT "FK_0c7c69c18392029333a5c443435" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" ADD CONSTRAINT "FK_f317248b5c53a0d762aec1cabba" FOREIGN KEY ("answer_id") REFERENCES "patient_question_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_appreciations" DROP CONSTRAINT "FK_f317248b5c53a0d762aec1cabba"`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" DROP CONSTRAINT "FK_0c7c69c18392029333a5c443435"`);
        await queryRunner.query(`DROP TABLE "answer_appreciations"`);
    }

}
