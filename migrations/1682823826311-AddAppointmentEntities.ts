import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointmentEntities1682823826311 implements MigrationInterface {
    name = 'AddAppointmentEntities1682823826311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctor_time_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "availability" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "doctor_id" uuid NOT NULL, CONSTRAINT "PK_63d5b22af8d0e2f639346cb7db0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consult_appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying(100) NOT NULL DEFAULT 'UPCOMING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, "doctor_time_slot_id" uuid, CONSTRAINT "PK_b4bf891f18e0d62d91c61f3fda4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" ADD CONSTRAINT "FK_2cedde845f4a3669d3fa669c1cf" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD CONSTRAINT "FK_1470631d704e7f80c7f89e63f94" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" ADD CONSTRAINT "FK_4e903bd743cc67b0d3c8743395d" FOREIGN KEY ("doctor_time_slot_id") REFERENCES "doctor_time_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP CONSTRAINT "FK_4e903bd743cc67b0d3c8743395d"`);
        await queryRunner.query(`ALTER TABLE "consult_appointments" DROP CONSTRAINT "FK_1470631d704e7f80c7f89e63f94"`);
        await queryRunner.query(`ALTER TABLE "doctor_time_slots" DROP CONSTRAINT "FK_2cedde845f4a3669d3fa669c1cf"`);
        await queryRunner.query(`DROP TABLE "consult_appointments"`);
        await queryRunner.query(`DROP TABLE "doctor_time_slots"`);
    }

}
