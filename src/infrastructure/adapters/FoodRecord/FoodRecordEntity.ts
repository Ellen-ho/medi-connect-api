import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { FoodCategoryType } from '../../../domain/foodRecord/FoodRecord'

@Entity('foodRecods')
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

  @Column({ name: 'amount', type: 'number', length: 50 })
  public amount!: number

  @Column({ name: 'calories', type: 'number', length: 50 })
  public calories!: number

  @Column({ name: 'food_note', type: 'varchar', length: 150, nullable: true })
  public foodNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
