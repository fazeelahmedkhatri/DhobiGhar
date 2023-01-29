import { MigrationInterface, QueryRunner } from 'typeorm';

export class changedBusinessUrgentChargesPercentageFromStringToNumber1674731228560
  implements MigrationInterface
{
  name =
    'changedBusinessUrgentChargesPercentageFromStringToNumber1674731228560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN "urgent_charges_percentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD "urgent_charges_percentage" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" DROP COLUMN "urgent_charges_percentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD "urgent_charges_percentage" character varying`,
    );
  }
}
