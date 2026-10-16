import { MigrationInterface, QueryRunner } from "typeorm";

export class EnablePostgis1760000000000 implements MigrationInterface {
  name = "EnablePostgis1760000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "postgis"');
  }

  public async down(): Promise<void> {
    // PostGIS is a database-level dependency and should not be removed on rollback.
  }
}
