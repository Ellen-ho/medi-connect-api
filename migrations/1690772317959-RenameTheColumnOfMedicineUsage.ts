import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTheColumnOfMedicineUsage1690772317959 implements MigrationInterface {
    name = 'RenameTheColumnOfMedicineUsage1690772317959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" RENAME COLUMN "medicince_usage" TO "medicine_usage"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" RENAME COLUMN "medicine_usage" TO "medicince_usage"`);
    }

}
