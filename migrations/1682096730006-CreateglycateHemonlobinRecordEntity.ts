import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateglycateHemonlobinRecordEntity1682096730006 implements MigrationInterface {
    name = 'CreateglycateHemonlobinRecordEntity1682096730006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "glycated_hemoglobin_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "glycated_hemoglobin_date" TIMESTAMP NOT NULL, "glycated_hemoglobin_value" numeric(3,2) NOT NULL, "glycated_hemoglobin_unit" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_ae460277e01dc75ad240c093a95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" ADD CONSTRAINT "FK_f18ca1c0b031989124bc5588965" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glycated_hemoglobin_records" DROP CONSTRAINT "FK_f18ca1c0b031989124bc5588965"`);
        await queryRunner.query(`DROP TABLE "glycated_hemoglobin_records"`);
    }

}
