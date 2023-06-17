import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMeetingLinkEntity1687025337096 implements MigrationInterface {
    name = 'AddMeetingLinkEntity1687025337096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meeting_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "link" character varying(255) NOT NULL, "status" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_eee33bb88527b09429ec0957dd2" UNIQUE ("link"), CONSTRAINT "PK_48f0c200c60400feec98cb13d18" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "meeting_links"`);
    }

}
