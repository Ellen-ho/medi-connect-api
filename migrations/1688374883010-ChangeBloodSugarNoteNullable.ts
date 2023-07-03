import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBloodSugarNoteNullable1688374883010 implements MigrationInterface {
    name = 'ChangeBloodSugarNoteNullable1688374883010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ALTER COLUMN "blood_sugar_note" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ALTER COLUMN "blood_sugar_note" SET NOT NULL`);
    }

}
