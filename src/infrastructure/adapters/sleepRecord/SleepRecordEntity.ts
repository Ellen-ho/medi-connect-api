import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { SleepQualityType } from '../../../domain/sleepRecord/SleepRecord'

@Entity('sleepRecords')
export class SleepRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'sleep_date' })
  public sleepDate!: Date

  @Column({ name: 'sleep_time' })
  public sleepTime!: Date

  @Column({ name: 'wake_up_time' })
  public wakeUpTime!: Date

  @Column({ name: 'sleep_quality' })
  public sleepQuality!: SleepQualityType

  @Column({ name: 'sleep_duration' })
  public sleepDuration!: number

  @Column({ name: 'sleep_note' })
  public sleepNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  public updateAt!: Date
}
