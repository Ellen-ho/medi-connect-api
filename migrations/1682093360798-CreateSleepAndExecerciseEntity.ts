import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSleepAndExecerciseEntity1682093360798 implements MigrationInterface {
    name = 'CreateSleepAndExecerciseEntity1682093360798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exercise_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "exercise_date" TIMESTAMP NOT NULL, "exercise_type" character varying(100) NOT NULL, "exercise_duration_minute" numeric(5,2) NOT NULL, "exercise_intensity" character varying(100) NOT NULL, "kcalories_burned" numeric(5,2) NOT NULL, "exercise_note" character varying(150) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_b9684215c946799382f8052ff0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sleep_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sleep_date" TIMESTAMP NOT NULL, "sleep_time" TIMESTAMP NOT NULL, "wake_up_time" TIMESTAMP NOT NULL, "sleep_quality" character varying(100) NOT NULL, "sleep_duration_hour" numeric(5,2) NOT NULL, "sleep_note" character varying(150) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_6d614aaa3b623405f5fa8149806" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercise_records" ADD CONSTRAINT "FK_382adc02131e67335f99203bc4f" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sleep_records" ADD CONSTRAINT "FK_a5ffac9c98d5ddc320233ed1dca" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sleep_records" DROP CONSTRAINT "FK_a5ffac9c98d5ddc320233ed1dca"`);
        await queryRunner.query(`ALTER TABLE "exercise_records" DROP CONSTRAINT "FK_382adc02131e67335f99203bc4f"`);
        await queryRunner.query(`DROP TABLE "sleep_records"`);
        await queryRunner.query(`DROP TABLE "exercise_records"`);
    }

}
