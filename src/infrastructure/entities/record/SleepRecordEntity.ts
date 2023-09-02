import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm'
import { SleepQualityType } from '../../../domain/record/SleepRecord'
import { PatientEntity } from '../patient/PatientEntity'
import { Transform } from 'class-transformer'

@Entity('sleep_records')
export class SleepRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'sleep_date' })
  public sleepDate!: Date

  @Column({ name: 'sleep_time' })
  public sleepTime!: Date

  @Column({ name: 'wake_up_time' })
  public wakeUpTime!: Date

  @Column({ name: 'sleep_quality', type: 'varchar', length: 100 })
  public sleepQuality!: SleepQualityType

  @Column({
    name: 'sleep_duration_hour',
    type: 'numeric',
    precision: 3,
    scale: 1,
  })
  @Transform(({ value }) => Number(value))
  public sleepDurationHour!: string

  @Column({ name: 'sleep_note', type: 'varchar', length: 250, nullable: true })
  public sleepNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId((sleepRecord: SleepRecordEntity) => sleepRecord.patient)
  public patientId!: string
}
