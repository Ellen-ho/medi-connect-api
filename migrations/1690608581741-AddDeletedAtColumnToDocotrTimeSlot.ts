import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnToDocotrTimeSlot1690608581741 implements MigrationInterface {
    name = 'AddDeletedAtColumnToDocotrTimeSlot1690608581741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP COLUMN "deleted_at"`);
    }

}
