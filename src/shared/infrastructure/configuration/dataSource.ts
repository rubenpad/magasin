import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [],
  migrations: [__dirname + "/migrations/*.js"],
  migrationsTableName: "migrations",
  synchronize: false,
  installExtensions: false,
});
