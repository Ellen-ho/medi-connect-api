import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('bloodSugarRecords')
export class BloodSugarRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'blood_sugar_date' })
  public bloodSugarDate!: Date

  @Column({ name: 'blood_sugar_value', type: 'number', length: 50 })
  public bloodSugarValue!: number

  @Column({ name: 'blood_sugar_note', type: 'varchar', length: 150 })
  public bloodSugarNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
