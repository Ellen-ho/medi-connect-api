import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferenceIdToNotification1690905221574 implements MigrationInterface {
    name = 'AddReferenceIdToNotification1690905221574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "reference_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "reference_id"`);
    }

}
