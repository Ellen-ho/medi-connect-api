import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('bloodPressureRecords')
export class BloodPressureRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'blood_pressure_date' })
  public bloodPressureDate!: Date

  @Column({ name: 'systolic_blood_pressure', type: 'number', length: 50 })
  public systolicBloodPressure!: number

  @Column({ name: 'diastolic_blood_pressure', type: 'number', length: 50 })
  public diastolicBloodPressure!: number

  @Column({ name: 'heart_beat', type: 'number', length: 50 })
  public heartBeat!: number

  @Column({ name: ' blood_pressure_note', type: 'number', length: 150 })
  public bloodPressureNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
