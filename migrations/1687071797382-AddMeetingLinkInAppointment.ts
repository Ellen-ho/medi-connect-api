import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMeetingLinkInAppointment1687071797382 implements MigrationInterface {
    name = 'AddMeetingLinkInAppointment1687071797382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" RENAME COLUMN "updated_at" TO "meeting_link"`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP COLUMN "meeting_link"`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD "meeting_link" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP COLUMN "meeting_link"`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD "meeting_link" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" RENAME COLUMN "meeting_link" TO "updated_at"`);
    }

}
