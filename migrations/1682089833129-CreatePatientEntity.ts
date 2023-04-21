import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientEntity1682089833129 implements MigrationInterface {
    name = 'CreatePatientEntity1682089833129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar" character varying(255) NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "birth_date" TIMESTAMP NOT NULL, "gender" character varying(20) NOT NULL, "medical_history" jsonb NOT NULL, "allergy" jsonb NOT NULL, "family_history" jsonb NOT NULL, "height" numeric(5,2) NOT NULL DEFAULT '0', "height_unit" character varying(20) NOT NULL, "medicince_usage" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "REL_7fe1518dc780fd777669b5cb7a" UNIQUE ("user_id"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "display_name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41" UNIQUE ("display_name")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_7fe1518dc780fd777669b5cb7a0"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "display_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name")`);
        await queryRunner.query(`DROP TABLE "patients"`);
    }

}
