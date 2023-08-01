import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferenceIdToNotification1690904291261 implements MigrationInterface {
    name = 'AddReferenceIdToNotification1690904291261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "reference_id" character varying(36) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "reference_id"`);
    }

}
