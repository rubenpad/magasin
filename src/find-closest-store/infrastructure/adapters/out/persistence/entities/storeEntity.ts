import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { StoreScheduleEntity } from "@infrastructure/adapters/out/persistence/entities/storeScheduleEntity";

@Entity({ name: "stores" })
export class StoreEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "geography", spatialFeatureType: "Point", srid: 4326 })
  location!: string;

  @Column({ type: "varchar", length: 64 })
  timezone!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @OneToMany(() => StoreScheduleEntity, (schedule) => schedule.store)
  schedules!: StoreScheduleEntity[];
}
