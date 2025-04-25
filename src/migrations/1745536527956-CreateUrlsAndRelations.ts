import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUrlsAndRelations1745536527956 implements MigrationInterface {
  name = 'CreateUrlsAndRelations1745536527956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "urls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "originalUrl" character varying NOT NULL, "code" character varying NOT NULL, "shortUrl" character varying NOT NULL, "accesses" integer NOT NULL DEFAULT '0', "expiresAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_eaf7bec915960b26aa4988d73b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "urls" ADD CONSTRAINT "FK_3088b58113241e3f5f6c10cf1fb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "urls" DROP CONSTRAINT "FK_3088b58113241e3f5f6c10cf1fb"`,
    );
    await queryRunner.query(`DROP TABLE "urls"`);
  }
}
