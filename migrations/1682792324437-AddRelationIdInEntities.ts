import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationIdInEntities1682792324437 implements MigrationInterface {
    name = 'AddRelationIdInEntities1682792324437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP CONSTRAINT "FK_497c04b6937ea41a2ae2734e57b"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ALTER COLUMN "asker_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP CONSTRAINT "FK_a8c5705e9df20b39d92802d5998"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP CONSTRAINT "FK_a22a7913c07f50598d15921e94e"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ALTER COLUMN "patient_question_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ALTER COLUMN "doctor_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP CONSTRAINT "FK_a3bc83f8ddb0e4d085026a08ea2"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP CONSTRAINT "FK_e347d861f0ddad55516f2b79fe2"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ALTER COLUMN "patient_question_answer_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ALTER COLUMN "agreed_doctor_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" DROP CONSTRAINT "FK_27197becd1b22ab0a2d5deaa3ee"`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ALTER COLUMN "patient_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP CONSTRAINT "FK_50ff5590f75cdc5c26d8aabae53"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ALTER COLUMN "patient_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise_records" DROP CONSTRAINT "FK_382adc02131e67335f99203bc4f"`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ALTER COLUMN "patient_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" DROP CONSTRAINT "FK_f18ca1c0b031989124bc5588965"`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ALTER COLUMN "patient_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "weight_records" DROP CONSTRAINT "FK_4133e8f0814bd674ece29e81c22"`);
        await queryRunner.query(`ALTER TABLE "weight_records" ALTER COLUMN "patient_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sleep_records" DROP CONSTRAINT "FK_a5ffac9c98d5ddc320233ed1dca"`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ALTER COLUMN "patient_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD CONSTRAINT "FK_497c04b6937ea41a2ae2734e57b" FOREIGN KEY ("asker_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD CONSTRAINT "FK_a8c5705e9df20b39d92802d5998" FOREIGN KEY ("patient_question_id") REFERENCES "patient_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD CONSTRAINT "FK_a22a7913c07f50598d15921e94e" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD CONSTRAINT "FK_a3bc83f8ddb0e4d085026a08ea2" FOREIGN KEY ("patient_question_answer_id") REFERENCES "patient_question_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD CONSTRAINT "FK_e347d861f0ddad55516f2b79fe2" FOREIGN KEY ("agreed_doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ADD CONSTRAINT "FK_27197becd1b22ab0a2d5deaa3ee" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD CONSTRAINT "FK_50ff5590f75cdc5c26d8aabae53" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ADD CONSTRAINT "FK_382adc02131e67335f99203bc4f" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ADD CONSTRAINT "FK_f18ca1c0b031989124bc5588965" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weight_records" ADD CONSTRAINT "FK_4133e8f0814bd674ece29e81c22" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ADD CONSTRAINT "FK_a5ffac9c98d5ddc320233ed1dca" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sleep_records" DROP CONSTRAINT "FK_a5ffac9c98d5ddc320233ed1dca"`);
        await queryRunner.query(`ALTER TABLE "weight_records" DROP CONSTRAINT "FK_4133e8f0814bd674ece29e81c22"`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" DROP CONSTRAINT "FK_f18ca1c0b031989124bc5588965"`);
        await queryRunner.query(`ALTER TABLE "exercise_records" DROP CONSTRAINT "FK_382adc02131e67335f99203bc4f"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP CONSTRAINT "FK_50ff5590f75cdc5c26d8aabae53"`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" DROP CONSTRAINT "FK_27197becd1b22ab0a2d5deaa3ee"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP CONSTRAINT "FK_e347d861f0ddad55516f2b79fe2"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP CONSTRAINT "FK_a3bc83f8ddb0e4d085026a08ea2"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP CONSTRAINT "FK_a22a7913c07f50598d15921e94e"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP CONSTRAINT "FK_a8c5705e9df20b39d92802d5998"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP CONSTRAINT "FK_497c04b6937ea41a2ae2734e57b"`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ALTER COLUMN "patient_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ADD CONSTRAINT "FK_a5ffac9c98d5ddc320233ed1dca" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weight_records" ALTER COLUMN "patient_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "weight_records" ADD CONSTRAINT "FK_4133e8f0814bd674ece29e81c22" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ALTER COLUMN "patient_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ADD CONSTRAINT "FK_f18ca1c0b031989124bc5588965" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ALTER COLUMN "patient_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ADD CONSTRAINT "FK_382adc02131e67335f99203bc4f" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ALTER COLUMN "patient_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD CONSTRAINT "FK_50ff5590f75cdc5c26d8aabae53" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ALTER COLUMN "patient_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ADD CONSTRAINT "FK_27197becd1b22ab0a2d5deaa3ee" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ALTER COLUMN "agreed_doctor_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ALTER COLUMN "patient_question_answer_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD CONSTRAINT "FK_e347d861f0ddad55516f2b79fe2" FOREIGN KEY ("agreed_doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD CONSTRAINT "FK_a3bc83f8ddb0e4d085026a08ea2" FOREIGN KEY ("patient_question_answer_id") REFERENCES "patient_question_answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ALTER COLUMN "doctor_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ALTER COLUMN "patient_question_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD CONSTRAINT "FK_a22a7913c07f50598d15921e94e" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD CONSTRAINT "FK_a8c5705e9df20b39d92802d5998" FOREIGN KEY ("patient_question_id") REFERENCES "patient_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ALTER COLUMN "asker_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD CONSTRAINT "FK_497c04b6937ea41a2ae2734e57b" FOREIGN KEY ("asker_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
