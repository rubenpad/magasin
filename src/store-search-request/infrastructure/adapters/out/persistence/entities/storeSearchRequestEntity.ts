import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "store_search_requests" })
export class StoreSearchRequestEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "request_id", type: "uuid", unique: true })
  requestId!: string;

  @Column({ name: "requested_at", type: "timestamptz" })
  requestedAt!: Date;

  @Column({
    name: "requested_location",
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  requestedLocation!: string;

  @Column({ name: "max_search_radius_meters", type: "integer" })
  maxSearchRadiusMeters!: number;

  @Column({ name: "selected_store_id", type: "uuid", nullable: true })
  selectedStoreId!: string | null;

  @Column({
    name: "selected_store_distance_meters",
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: true,
  })
  selectedStoreDistanceMeters!: number | null;

  @Column({ name: "selected_store_is_open", type: "boolean", nullable: true })
  selectedStoreIsOpen!: boolean | null;

  @Column({ name: "response_status", type: "smallint" })
  responseStatus!: number;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
