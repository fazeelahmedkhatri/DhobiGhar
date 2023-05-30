import { MigrationInterface, QueryRunner } from "typeorm";

export class paymentEntity1683809661458 implements MigrationInterface {
    name = 'paymentEntity1683809661458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" integer, "updated_by" integer, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "total_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "is_payment_completed" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "is_payment_completed"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "total_amount"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
