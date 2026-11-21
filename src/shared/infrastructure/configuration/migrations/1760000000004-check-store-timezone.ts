import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckStoreTimezone1760000000004 implements MigrationInterface {
  name = "CheckStoreTimezone1760000000004";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION is_valid_timezone(zone text) RETURNS boolean
      LANGUAGE plpgsql STABLE AS $$
      BEGIN
        PERFORM now() AT TIME ZONE zone;
        RETURN true;
      EXCEPTION WHEN invalid_parameter_value THEN
        RETURN false;
      END;
      $$
    `);
    await queryRunner.query(
      `ALTER TABLE stores ADD CONSTRAINT stores_valid_timezone_check CHECK (is_valid_timezone(timezone))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE stores DROP CONSTRAINT stores_valid_timezone_check`);
    await queryRunner.query(`DROP FUNCTION is_valid_timezone(text)`);
  }
}
