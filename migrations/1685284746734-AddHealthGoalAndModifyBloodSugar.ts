import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHealthGoalAndModifyBloodSugar1685284746734 implements MigrationInterface {
    name = 'AddHealthGoalAndModifyBloodSugar1685284746734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patient_health_goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blood_pressure_target_value" jsonb NOT NULL DEFAULT '{"systolicBloodPressure":null,"diastolicBloodPressure":null}', "blood_sugar_target_value" numeric(5,2), "blood_sugar_target_type" character varying(100) NOT NULL, "glycated_hemonglobin_target_value" numeric(5,2), "weight_target_value" numeric(5,2), "body_mass_index" numeric(5,2), "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "result" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, "doctor_id" uuid, CONSTRAINT "PK_e528b92b6afe361c2aa3ee23ea4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_value_mmol"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_value" numeric(5,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_type" character varying(150) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patient_health_goals" ADD CONSTRAINT "FK_183eaaad1f628161e049edc4695" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patient_health_goals" ADD CONSTRAINT "FK_9501eaf8501a0f19c99c488aa5a" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patient_health_goals" DROP CONSTRAINT "FK_9501eaf8501a0f19c99c488aa5a"`);
        await queryRunner.query(`ALTER TABLE "patient_health_goals" DROP CONSTRAINT "FK_183eaaad1f628161e049edc4695"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_type"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" DROP COLUMN "blood_sugar_value"`);
        await queryRunner.query(`ALTER TABLE "blood_sugar_records" ADD "blood_sugar_value_mmol" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "patient_health_goals"`);
    }

}
