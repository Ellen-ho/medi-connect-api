import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDoctorTimeSlotType1713360384294 implements MigrationInterface {
  name = 'AddDoctorTimeSlotType1713360384294'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_time_slots" ADD "type" character varying(20) NOT NULL DEFAULT 'ONLINE'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_time_slots" DROP COLUMN "type"`
    )
  }
}
