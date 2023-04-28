import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteAt1682681636082 implements MigrationInterface {
    name = 'AddDeleteAt1682681636082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_questions" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "answer_apprieciations" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" ALTER COLUMN "comment" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_agreements" ALTER COLUMN "comment" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer_apprieciations" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "answer_agreements" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "patient_question_answers" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "patient_questions" DROP COLUMN "deleted_at"`);
    }

}
