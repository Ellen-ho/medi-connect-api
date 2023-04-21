import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('glycatedHemoglobinRecords')
export class GlycatedHemoglobinRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'glycated_hemoglobin_date' })
  public glycatedHemoglobinDate!: Date

  @Column({ name: ' glycated_hemoglobin_value', type: 'number', length: 50 })
  public glycatedHemoglobinValue!: number

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
