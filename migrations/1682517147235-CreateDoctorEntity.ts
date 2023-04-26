import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDoctorEntity1682517147235 implements MigrationInterface {
    name = 'CreateDoctorEntity1682517147235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar" character varying(255), "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "gender" character varying(20) NOT NULL, "about_me" character varying(400) NOT NULL, "languages_spoken" jsonb NOT NULL, "specialties" jsonb NOT NULL, "career_start_date" TIMESTAMP NOT NULL, "office_practical_location" jsonb NOT NULL, "education" jsonb NOT NULL, "awards" jsonb, "affiliations" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "REL_653c27d1b10652eb0c7bbbc442" UNIQUE ("user_id"), CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctors" ADD CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT "FK_653c27d1b10652eb0c7bbbc4427"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
    }

}
