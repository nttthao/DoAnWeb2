import {MigrationInterface, QueryRunner} from "typeorm";

export class addMovieDeletedColumn1625987713854 implements MigrationInterface {
    name = 'addMovieDeletedColumn1625987713854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "deleted"`);
    }

}
