import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAndPatientEntities1682264280046 implements MigrationInterface {
    name = 'UpdateUserAndPatientEntities1682264280046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "avatar" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "medical_history" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "family_history" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "medicince_usage" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "medicince_usage" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "family_history" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "medical_history" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ALTER COLUMN "avatar" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
