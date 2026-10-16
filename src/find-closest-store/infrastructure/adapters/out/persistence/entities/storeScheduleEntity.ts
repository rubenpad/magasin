import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { StoreEntity } from "@infrastructure/adapters/out/persistence/entities/storeEntity";

@Entity({ name: "store_schedules" })
export class StoreScheduleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "store_id", type: "uuid" })
  storeId!: string;

  @Column({ name: "day_of_week", type: "smallint" })
  dayOfWeek!: number;

  @Column({ name: "start_time", type: "time" })
  startTime!: string;

  @Column({ name: "end_time", type: "time" })
  endTime!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @ManyToOne(() => StoreEntity, (store) => store.schedules, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "store_id" })
  store!: StoreEntity;
}
