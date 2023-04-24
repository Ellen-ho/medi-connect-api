import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PatientEntity } from '../patient/PatientEntity'

@Entity('glycated_hemoglobin_records')
export class GlycatedHemoglobinRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'glycated_hemoglobin_date' })
  public glycatedHemoglobinDate!: Date

  @Column({
    name: 'glycated_hemoglobin_value_percent',
    type: 'numeric',
    precision: 3,
    scale: 2,
  })
  public glycatedHemoglobinValuePercent!: number

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
