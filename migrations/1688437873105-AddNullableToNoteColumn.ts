import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNullableToNoteColumn1688437873105 implements MigrationInterface {
    name = 'AddNullableToNoteColumn1688437873105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ALTER COLUMN "blood_pressure_note" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ALTER COLUMN "exercise_note" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ALTER COLUMN "sleep_note" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "weight_records" ALTER COLUMN "weight_note" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weight_records" ALTER COLUMN "weight_note" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ALTER COLUMN "sleep_note" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ALTER COLUMN "exercise_note" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ALTER COLUMN "blood_pressure_note" SET NOT NULL`);
    }

}
