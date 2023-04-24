import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyRecords1682357329596 implements MigrationInterface {
    name = 'ModifyRecords1682357329596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "height_unit"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_value"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_unit"`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" DROP COLUMN "glycated_hemoglobin_value"`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" DROP COLUMN "glycated_hemoglobin_unit"`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "height_value_cm" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_value_mmol" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ADD "glycated_hemoglobin_value_percent" numeric(3,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" DROP COLUMN "glycated_hemoglobin_value_percent"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_value_mmol"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "height_value_cm"`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ADD "glycated_hemoglobin_unit" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ADD "glycated_hemoglobin_value" numeric(3,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_unit" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "height_unit" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "height" numeric(5,2) NOT NULL DEFAULT '0'`);
    }

}
