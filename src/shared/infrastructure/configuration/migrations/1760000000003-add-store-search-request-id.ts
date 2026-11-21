import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreSearchRequestId1760000000003 implements MigrationInterface {
  name = "AddStoreSearchRequestId1760000000003";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE store_search_requests ADD COLUMN request_id uuid NOT NULL DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE store_search_requests ALTER COLUMN request_id DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE store_search_requests
         ADD CONSTRAINT uq_store_search_requests_request_id UNIQUE (request_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE store_search_requests DROP CONSTRAINT uq_store_search_requests_request_id`,
    );
    await queryRunner.query(`ALTER TABLE store_search_requests DROP COLUMN request_id`);
  }
}
