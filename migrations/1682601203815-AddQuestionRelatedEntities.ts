import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionRelatedEntities1682601203815 implements MigrationInterface {
    name = 'AddQuestionRelatedEntities1682601203815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300) NOT NULL, "medical_specialty" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "asker_id" uuid, CONSTRAINT "PK_0f4155eb8f4c3d0d55921a8e3c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patient_question_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_question_id" uuid, "doctor_id" uuid, CONSTRAINT "PK_a6cbf4f2404deaa34cfc1e065d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer_agreements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying(400) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_question_answer_id" uuid, "agreed_doctor_id" uuid, CONSTRAINT "PK_4c2d66d172dec089eac0488f28e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer_apprieciations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, "answer_id" uuid, CONSTRAINT "PK_d59ba2e8ff1a492676af7514788" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD CONSTRAINT "FK_497c04b6937ea41a2ae2734e57b" FOREIGN KEY ("asker_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD CONSTRAINT "FK_a8c5705e9df20b39d92802d5998" FOREIGN KEY ("patient_question_id") REFERENCES "patient_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD CONSTRAINT "FK_a22a7913c07f50598d15921e94e" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD CONSTRAINT "FK_a3bc83f8ddb0e4d085026a08ea2" FOREIGN KEY ("patient_question_answer_id") REFERENCES "patient_question_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD CONSTRAINT "FK_e347d861f0ddad55516f2b79fe2" FOREIGN KEY ("agreed_doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_apprieciations" ADD CONSTRAINT "FK_68b4185a4942a3819dd87fb710e" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_apprieciations" ADD CONSTRAINT "FK_8404b28d16db2544fb85af90d1d" FOREIGN KEY ("answer_id") REFERENCES "patient_question_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_apprieciations" DROP CONSTRAINT "FK_8404b28d16db2544fb85af90d1d"`);
        await queryRunner.query(`ALTER TABLE "answer_apprieciations" DROP CONSTRAINT "FK_68b4185a4942a3819dd87fb710e"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP CONSTRAINT "FK_e347d861f0ddad55516f2b79fe2"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP CONSTRAINT "FK_a3bc83f8ddb0e4d085026a08ea2"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP CONSTRAINT "FK_a22a7913c07f50598d15921e94e"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP CONSTRAINT "FK_a8c5705e9df20b39d92802d5998"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP CONSTRAINT "FK_497c04b6937ea41a2ae2734e57b"`);
        await queryRunner.query(`DROP TABLE "answer_apprieciations"`);
        await queryRunner.query(`DROP TABLE "answer_agreements"`);
        await queryRunner.query(`DROP TABLE "patient_question_answers"`);
        await queryRunner.query(`DROP TABLE "patient_questions"`);
    }

}
