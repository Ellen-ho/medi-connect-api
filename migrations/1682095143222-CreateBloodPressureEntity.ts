import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBloodPressureEntity1682095143222 implements MigrationInterface {
    name = 'CreateBloodPressureEntity1682095143222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blood_pressure_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blood_pressure_date" TIMESTAMP NOT NULL, "systolic_blood_pressure" integer NOT NULL, "diastolic_blood_pressure" integer NOT NULL, "heart_beat" integer NOT NULL, "blood_pressure_note" character varying(150) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_97de7e4fba1c33aee5e86f4344f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" ADD CONSTRAINT "FK_27197becd1b22ab0a2d5deaa3ee" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_pressure_records" DROP CONSTRAINT "FK_27197becd1b22ab0a2d5deaa3ee"`);
        await queryRunner.query(`DROP TABLE "blood_pressure_records"`);
    }

}
