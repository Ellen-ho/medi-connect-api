import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySleepDurationHour1688472335908 implements MigrationInterface {
    name = 'ModifySleepDurationHour1688472335908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sleep_records" ALTER COLUMN "sleep_duration_hour" TYPE numeric(3,1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sleep_records" ALTER COLUMN "sleep_duration_hour" TYPE numeric(5,2)`);
    }

}
