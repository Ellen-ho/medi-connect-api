import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('exerciseRecords')
export class ExerciseRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'exerciseDate', type: 'varchar', length: 20 })
  public exerciseDate!: string

  @Column({ name: 'exerciseType', type: 'varchar', length: 100 })
  public exerciseType!: string

  @Column({ name: 'duration', type: 'varchar', length: 20 })
  public duration!: string

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  public updateAt!: Date

}