import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtInHealthGoalEntity1687073801043 implements MigrationInterface {
    name = 'AddDeletedAtInHealthGoalEntity1687073801043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "health_goals" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "health_goals" DROP COLUMN "deleted_at"`);
    }

}
