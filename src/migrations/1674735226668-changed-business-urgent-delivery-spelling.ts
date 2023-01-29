import { MigrationInterface, QueryRunner } from 'typeorm';

export class changedBusinessUrgentDeliverySpelling1674735226668
  implements MigrationInterface
{
  name = 'changedBusinessUrgentDeliverySpelling1674735226668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" RENAME COLUMN "urgent_devliery" TO "urgent_delivery"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business" RENAME COLUMN "urgent_delivery" TO "urgent_devliery"`,
    );
  }
}
