import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveHealthGoalResultColumn1696909936480 implements MigrationInterface {
    name = 'RemoveHealthGoalResultColumn1696909936480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "health_goals" ALTER COLUMN "result" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "health_goals" ALTER COLUMN "result" DROP NOT NULL`);
    }

}
