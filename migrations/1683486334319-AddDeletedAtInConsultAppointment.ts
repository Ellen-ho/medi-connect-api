import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtInConsultAppointment1683486334319 implements MigrationInterface {
    name = 'AddDeletedAtInConsultAppointment1683486334319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP COLUMN "deleted_at"`);
    }

}
