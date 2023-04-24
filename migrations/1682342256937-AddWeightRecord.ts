import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWeightRecord1682342256937 implements MigrationInterface {
    name = 'AddWeightRecord1682342256937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weight_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weight_date" TIMESTAMP NOT NULL, "weight_value_kg" numeric(5,2) NOT NULL, "body_mass_index" numeric(5,2) NOT NULL, "weight_note" character varying(150) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_542ae7246e106abae23226b2a6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "weight_records" ADD CONSTRAINT "FK_4133e8f0814bd674ece29e81c22" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weight_records" DROP CONSTRAINT "FK_4133e8f0814bd674ece29e81c22"`);
        await queryRunner.query(`DROP TABLE "weight_records"`);
    }

}
