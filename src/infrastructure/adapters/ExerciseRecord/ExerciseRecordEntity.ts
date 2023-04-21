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

  @Column({ name: 'duration', type: 'number', length: 50 })
  public duration!: number

  @Column({ name: 'intensity', type: 'varchar', length: 100 })
  public intensity!: IntensityType

  @Column({ name: 'calories_burned', type: 'number', length: 50 })
  public caloriesBurned!: number

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  public updateAt!: Date
}
