import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateStoreTables1760000000001 implements MigrationInterface {
  name = "CreateStoreTables1760000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "stores",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            default: "gen_random_uuid()",
          },
          { name: "name", type: "varchar", length: "255", isNullable: false },
          {
            name: "location",
            type: "geography(POINT,4326)",
            isNullable: false,
          },
          {
            name: "timezone",
            type: "varchar",
            length: "64",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "store_schedules",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            default: "gen_random_uuid()",
          },
          { name: "store_id", type: "uuid", isNullable: false },
          { name: "day_of_week", type: "smallint", isNullable: false },
          { name: "start_time", type: "time", isNullable: false },
          { name: "end_time", type: "time", isNullable: false },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      "store_schedules",
      new TableForeignKey({
        name: "fk_store_schedules_store",
        columnNames: ["store_id"],
        referencedTableName: "stores",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );

    await queryRunner.createCheckConstraint(
      "store_schedules",
      new TableCheck({
        name: "store_schedules_day_of_week_check",
        expression: "day_of_week BETWEEN 1 AND 7",
      }),
    );
    await queryRunner.createCheckConstraint(
      "store_schedules",
      new TableCheck({
        name: "store_schedules_valid_interval_check",
        expression: "start_time < end_time",
      }),
    );

    await queryRunner.createIndex(
      "stores",
      new TableIndex({
        name: "idx_stores_location",
        columnNames: ["location"],
        isSpatial: true,
      }),
    );
    await queryRunner.createIndex(
      "store_schedules",
      new TableIndex({
        name: "idx_store_schedules_store_day",
        columnNames: ["store_id", "day_of_week"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("store_schedules");
    await queryRunner.dropTable("stores");
  }
}
