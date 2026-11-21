import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateStoreSearchRequestsTable1760000000002 implements MigrationInterface {
  name = "CreateStoreSearchRequestsTable1760000000002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "store_search_requests",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            default: "gen_random_uuid()",
          },
          { name: "requested_at", type: "timestamptz", isNullable: false },
          { name: "requested_location", type: "geography(POINT,4326)", isNullable: false },
          { name: "max_search_radius_meters", type: "integer", isNullable: false },
          { name: "selected_store_id", type: "uuid", isNullable: true },
          {
            name: "selected_store_distance_meters",
            type: "decimal",
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          { name: "selected_store_is_open", type: "boolean", isNullable: true },
          { name: "response_status", type: "smallint", isNullable: false },
          { name: "created_at", type: "timestamptz", isNullable: false, default: "now()" },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "store_search_requests",
      new TableForeignKey({
        name: "fk_store_search_requests_selected_store",
        columnNames: ["selected_store_id"],
        referencedTableName: "stores",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );

    await queryRunner.createIndex(
      "store_search_requests",
      new TableIndex({
        name: "idx_store_search_requests_requested_at",
        columnNames: ["requested_at"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("store_search_requests");
  }
}
