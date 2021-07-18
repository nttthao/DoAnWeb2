import {MigrationInterface, QueryRunner} from "typeorm";

export class addMovieAge1625985257167 implements MigrationInterface {
    name = 'addMovieAge1625985257167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "age" integer NOT NULL DEFAULT '13'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "age"`);
    }

}
