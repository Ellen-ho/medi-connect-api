import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyHealGoalEntityNameAndColumnName1685340226710 implements MigrationInterface {
    name = 'ModifyHealGoalEntityNameAndColumnName1685340226710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "health_goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blood_pressure_target_value" jsonb NOT NULL DEFAULT '{"systolicBloodPressure":null,"diastolicBloodPressure":null}', "blood_sugar_target_value" numeric(5,2), "blood_sugar_target_type" character varying(100) NOT NULL, "glycated_hemonglobin_target_value" numeric(5,2), "weight_target_value" numeric(5,2), "body_mass_index_target_value" numeric(5,2), "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "result" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, "doctor_id" uuid, CONSTRAINT "PK_9b6f6c8020eb44b63b43af34562" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "health_goals" ADD CONSTRAINT "FK_d7e050ebab3fad5428a9d3e84c8" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "health_goals" ADD CONSTRAINT "FK_3a88cac04d6306afbca665af56c" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "health_goals" DROP CONSTRAINT "FK_3a88cac04d6306afbca665af56c"`);
        await queryRunner.query(`ALTER TABLE "health_goals" DROP CONSTRAINT "FK_d7e050ebab3fad5428a9d3e84c8"`);
        await queryRunner.query(`DROP TABLE "health_goals"`);
    }

}
