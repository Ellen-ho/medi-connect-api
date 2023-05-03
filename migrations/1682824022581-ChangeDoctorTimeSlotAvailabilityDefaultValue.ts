import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDoctorTimeSlotAvailabilityDefaultValue1682824022581 implements MigrationInterface {
    name = 'ChangeDoctorTimeSlotAvailabilityDefaultValue1682824022581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ALTER COLUMN "availability" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ALTER COLUMN "availability" SET DEFAULT false`);
    }

}
