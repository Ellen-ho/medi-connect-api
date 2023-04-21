import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFoodEntity1682094389433 implements MigrationInterface {
    name = 'CreateFoodEntity1682094389433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "food_recods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "food_image" character varying(255), "food_time" TIMESTAMP NOT NULL, "food_item" character varying(255), "food_category" character varying(100) NOT NULL, "food_amount" numeric(5,2) NOT NULL, "kcalories" numeric(5,2) NOT NULL, "food_note" character varying(150), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid, CONSTRAINT "PK_f1c86ae0da1fe500be373e11b5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "food_recods" ADD CONSTRAINT "FK_2351fa8e6d54f7d4bfaec56a589" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_recods" DROP CONSTRAINT "FK_2351fa8e6d54f7d4bfaec56a589"`);
        await queryRunner.query(`DROP TABLE "food_recods"`);
    }

}
