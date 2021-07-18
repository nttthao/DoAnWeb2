import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePosterUrlType1625675621882 implements MigrationInterface {
  name = 'updatePosterUrlType1625675621882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "posterUrl"`);
    await queryRunner.query(
      `ALTER TABLE "movie" ADD "posterUrl" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "posterUrl"`);
    await queryRunner.query(
      `ALTER TABLE "movie" ADD "posterUrl" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
