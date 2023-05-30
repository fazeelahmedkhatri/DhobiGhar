import { MigrationInterface, QueryRunner } from "typeorm";

export class ordersBusinessId1683888036455 implements MigrationInterface {
    name = 'ordersBusinessId1683888036455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "business_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_0e78f67403faf37092dce90d73a" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_0e78f67403faf37092dce90d73a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "business_id"`);
    }

}
