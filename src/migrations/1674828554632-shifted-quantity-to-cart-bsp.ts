import { MigrationInterface, QueryRunner } from "typeorm";

export class shiftedQuantityToCartBsp1674828554632 implements MigrationInterface {
    name = 'shiftedQuantityToCartBsp1674828554632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "cart_business_service_products" ADD "quantity" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_business_service_products" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "quantity" integer NOT NULL`);
    }

}
