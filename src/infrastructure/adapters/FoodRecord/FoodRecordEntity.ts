import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { FoodCategoryType } from '../../../domain/foodRecord/FoodRecord'
import { PatientEntity } from '../Patient/PatientEntity'

@Entity('food_recods')
export class FoodRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'food_image', type: 'varchar', length: 255, nullable: true })
  public foodImage!: string | null

  @Column({ name: 'food_time' })
  public foodTime!: Date

  @Column({ name: 'food_item', type: 'varchar', length: 255, nullable: true })
  public foodItem!: string | null

  @Column({ name: 'food_category', type: 'varchar', length: 100 })
  public foodCategory!: FoodCategoryType

  @Column({ name: 'food_amount', type: 'numeric', precision: 5, scale: 2 })
  public foodAmount!: number

  @Column({ name: 'kcalories', type: 'numeric', precision: 5, scale: 2 })
  public kcalories!: number

  @Column({ name: 'food_note', type: 'varchar', length: 150, nullable: true })
  public foodNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity, (patient) => patient.foodRecords)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
