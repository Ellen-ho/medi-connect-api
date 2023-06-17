import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTheLengthOfTextAndVarchar1687025477757 implements MigrationInterface {
    name = 'ModifyTheLengthOfTextAndVarchar1687025477757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "about_me"`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "about_me" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD "status" character varying(150) NOT NULL DEFAULT 'UPCOMING'`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "notification_type"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "notification_type" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP COLUMN "medical_specialty"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD "medical_specialty" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" ADD "content" text`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD "comment" text`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" DROP COLUMN "blood_pressure_note"`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ADD "blood_pressure_note" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise_records" DROP COLUMN "exercise_note"`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ADD "exercise_note" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "food_records" DROP COLUMN "food_note"`);
        await queryRunner.query(`ALTER TABLE "food_records" ADD "food_note" character varying(250)`);
        await queryRunner.query(`ALTER TABLE "sleep_records" DROP COLUMN "sleep_note"`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ADD "sleep_note" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_note"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_note" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "weight_records" DROP COLUMN "weight_note"`);
        await queryRunner.query(`ALTER TABLE "weight_records" ADD "weight_note" character varying(250) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weight_records" DROP COLUMN "weight_note"`);
        await queryRunner.query(`ALTER TABLE "weight_records" ADD "weight_note" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_note"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_note" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sleep_records" DROP COLUMN "sleep_note"`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ADD "sleep_note" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "food_records" DROP COLUMN "food_note"`);
        await queryRunner.query(`ALTER TABLE "food_records" ADD "food_note" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "exercise_records" DROP COLUMN "exercise_note"`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ADD "exercise_note" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" DROP COLUMN "blood_pressure_note"`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ADD "blood_pressure_note" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD "comment" character varying(400)`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "answer_appreciations" ADD "content" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD "content" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP COLUMN "medical_specialty"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD "medical_specialty" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD "content" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "notification_type"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "notification_type" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "content" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "title" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD "status" character varying(100) NOT NULL DEFAULT 'UPCOMING'`);
        await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN "about_me"`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD "about_me" character varying(400) NOT NULL`);
    }

}
