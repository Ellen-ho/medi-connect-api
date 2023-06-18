import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMeetingLinkInAppointment1687073472233 implements MigrationInterface {
    name = 'AddMeetingLinkInAppointment1687073472233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD "meeting_link" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP COLUMN "meeting_link"`);
    }

}
