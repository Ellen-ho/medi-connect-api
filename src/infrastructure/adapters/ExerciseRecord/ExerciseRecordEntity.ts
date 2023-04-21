import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {
  ExerciseType,
  IntensityType,
} from '../../../domain/exerciseRecord/ExerciseRecord'

@Entity('exerciseRecords')
export class ExerciseRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'exercise_date' })
  public exerciseDate!: Date

  @Column({ name: 'exercise_type', type: 'varchar', length: 100 })
  public exerciseType!: ExerciseType

  @Column({ name: 'exercise_duration', type: 'number', length: 50 })
  public exerciseDuration!: number

  @Column({ name: 'exercise_intensity', type: 'varchar', length: 100 })
  public exerciseIntensity!: IntensityType

  @Column({ name: 'calories_burned', type: 'number', length: 50 })
  public caloriesBurned!: number

  @Column({ name: 'exercise_note', type: 'varchar', length: 150 })
  public exerciseNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date
}
