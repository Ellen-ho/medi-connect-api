import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('foodRecods')
export class FoodRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'foodImage', unique: true, type: 'varchar', length: 100 })
  public foodImage!: string

  @Column({ name: 'foodTime', type: 'varchar', length: 100 })
  public foodTime!: string

  @Column({ name: 'foodItem', type: 'varchar', length: 100 })
  public foodItem!: string

  @Column({ name: 'foodCategory', type: 'varchar', length: 100 })
  public foodCategory!: string

  @Column({ name: 'amount', type: 'varchar', length: 100 })
  public amount!: string

  @Column({ name: 'calories', type: 'varchar', length: 100 })
  public calories!: string

  @Column({ name: 'foodNote', type: 'varchar', length: 100 })
  public foodNote!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}