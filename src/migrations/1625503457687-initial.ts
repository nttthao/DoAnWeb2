import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1625503457687 implements MigrationInterface {
    name = 'initial1625503457687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "branch" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cinema" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "horizontalSize" integer NOT NULL, "verticalSize" integer NOT NULL, "branchId" integer, CONSTRAINT "PK_65912fd9911f64e56eadf654912" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "publishAt" TIMESTAMP NOT NULL DEFAULT now(), "posterUrl" TIMESTAMP NOT NULL DEFAULT now(), "duration" integer NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "show_time" ("id" SERIAL NOT NULL, "startAt" TIMESTAMP NOT NULL DEFAULT now(), "endAt" TIMESTAMP NOT NULL DEFAULT now(), "cinemaId" integer, "movieId" integer, CONSTRAINT "PK_cc3f4dd59958b5eb12a0b64a525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seat" character varying NOT NULL, "price" integer NOT NULL, "bookingId" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying, "isActive" boolean NOT NULL DEFAULT false, "activationCode" character varying, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "at" TIMESTAMP NOT NULL DEFAULT now(), "totalMoney" integer NOT NULL, "userId" integer, "showTimeId" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cinema" ADD CONSTRAINT "FK_8a5db14c8c0508c1f906f9d3ee8" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "show_time" ADD CONSTRAINT "FK_386797ee3943145250ea675907e" FOREIGN KEY ("cinemaId") REFERENCES "cinema"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "show_time" ADD CONSTRAINT "FK_483d100feb2f586540af5328f86" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_1c37434449c76d1725b3d4d6c80" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_bd6e856bfab0b75fb939f8168cb" FOREIGN KEY ("showTimeId") REFERENCES "show_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_bd6e856bfab0b75fb939f8168cb"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_1c37434449c76d1725b3d4d6c80"`);
        await queryRunner.query(`ALTER TABLE "show_time" DROP CONSTRAINT "FK_483d100feb2f586540af5328f86"`);
        await queryRunner.query(`ALTER TABLE "show_time" DROP CONSTRAINT "FK_386797ee3943145250ea675907e"`);
        await queryRunner.query(`ALTER TABLE "cinema" DROP CONSTRAINT "FK_8a5db14c8c0508c1f906f9d3ee8"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "show_time"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "cinema"`);
        await queryRunner.query(`DROP TABLE "branch"`);
    }

}
