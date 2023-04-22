import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import {
  ExerciseType,
  IntensityType,
} from '../../../domain/record/ExerciseRecord'
import { PatientEntity } from '../patient/PatientEntity'

@Entity('exercise_records')
export class ExerciseRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'exercise_date' })
  public exerciseDate!: Date

  @Column({ name: 'exercise_type', type: 'varchar', length: 100 })
  public exerciseType!: ExerciseType

  @Column({
    name: 'exercise_duration_minute',
    type: 'numeric',
    precision: 5,
    scale: 2,
  })
  public exerciseDurationMinute!: number

  @Column({ name: 'exercise_intensity', type: 'varchar', length: 100 })
  public exerciseIntensity!: IntensityType

  @Column({ name: 'kcalories_burned', type: 'numeric', precision: 5, scale: 2 })
  public kcaloriesBurned!: number

  @Column({ name: 'exercise_note', type: 'varchar', length: 150 })
  public exerciseNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
