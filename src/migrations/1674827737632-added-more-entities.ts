import { MigrationInterface, QueryRunner } from "typeorm";

export class addedMoreEntities1674827737632 implements MigrationInterface {
    name = 'addedMoreEntities1674827737632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."cart_cart_status_enum" AS ENUM('completed', 'discarded', 'open')`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "quantity" integer NOT NULL, "total_amount" integer NOT NULL, "cart_status" "public"."cart_cart_status_enum" NOT NULL DEFAULT 'open', "consumer_id" integer NOT NULL, CONSTRAINT "REL_93aa5d45537666f69cdd6e182a" UNIQUE ("consumer_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_business_service_products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, "cart_id" integer NOT NULL, "business_service_product_id" integer NOT NULL, CONSTRAINT "PK_1c8f2f7e0a732af74e4a096f7e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "business_service_products" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_93aa5d45537666f69cdd6e182a4" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_business_service_products" ADD CONSTRAINT "FK_9fae782b6ec097f7986e842e42d" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_business_service_products" ADD CONSTRAINT "FK_5ca220571967b7f33cb9c42bb4d" FOREIGN KEY ("business_service_product_id") REFERENCES "business_service_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_business_service_products" DROP CONSTRAINT "FK_5ca220571967b7f33cb9c42bb4d"`);
        await queryRunner.query(`ALTER TABLE "cart_business_service_products" DROP CONSTRAINT "FK_9fae782b6ec097f7986e842e42d"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_93aa5d45537666f69cdd6e182a4"`);
        await queryRunner.query(`ALTER TABLE "business_service_products" DROP COLUMN "price"`);
        await queryRunner.query(`DROP TABLE "cart_business_service_products"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TYPE "public"."cart_cart_status_enum"`);
    }

}
