import { MigrationInterface, QueryRunner } from "typeorm";

export class businessDescription1683980820292 implements MigrationInterface {
    name = 'businessDescription1683980820292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ADD "business_description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "business_description"`);
    }

}
