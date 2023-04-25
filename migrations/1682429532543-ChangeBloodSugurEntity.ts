import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBloodSugurEntity1682429532543 implements MigrationInterface {
    name = 'ChangeBloodSugurEntity1682429532543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_value_mmol"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_value_mmol" numeric(5,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_value_mmol"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_value_mmol" integer NOT NULL`);
    }

}
