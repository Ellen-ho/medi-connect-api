import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateNewFoodRecords1682702683256 implements MigrationInterface {
  name = 'CreateNewFoodRecords1682702683256'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "food_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "food_image" character varying(255), "food_time" TIMESTAMP NOT NULL, "food_item" character varying(255), "food_category" character varying(100) NOT NULL, "food_amount" numeric(5,2) NOT NULL, "kcalories" numeric(5,2) NOT NULL, "food_note" character varying(150), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" uuid NOT NULL, CONSTRAINT "PK_11f84af71017274532ef98f5d43" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "food_records" ADD CONSTRAINT "FK_0d3e7fdd96d58f6da0abd1b0073" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`DROP TABLE "food_recods"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "food_records" DROP CONSTRAINT "FK_0d3e7fdd96d58f6da0abd1b0073"`
    )
    await queryRunner.query(`DROP TABLE "food_records"`)
  }
}
