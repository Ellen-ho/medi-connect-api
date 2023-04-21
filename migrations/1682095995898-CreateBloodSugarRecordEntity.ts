import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBloodSugarRecordEntity1682095995898 implements MigrationInterface {
    name = 'CreateBloodSugarRecordEntity1682095995898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blood_sugar_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blood_sugar_date" TIMESTAMP NOT NULL, "blood_sugar_value" integer NOT NULL, "blood_sugar_unit" character varying(20) NOT NULL, "blood_sugar_note" character varying(150) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_17a95a072cabdc93aa6a8f31cfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD CONSTRAINT "FK_50ff5590f75cdc5c26d8aabae53" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP CONSTRAINT "FK_50ff5590f75cdc5c26d8aabae53"`);
        await queryRunner.query(`DROP TABLE "blood_sugar_records"`);
    }

}
