import {MigrationInterface, QueryRunner} from "typeorm";

export class addCinemaDeletedColumn1625996875005 implements MigrationInterface {
    name = 'addCinemaDeletedColumn1625996875005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" ADD "deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "cinema" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cinema" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "deleted"`);
    }

}
