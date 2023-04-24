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
import { WeightUnitType } from '../../../domain/record/WeightRecord'

@Entity('weight_records')
export class WeightRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'weight_date' })
  public weightDate!: Date

  @Column({ name: 'weight_value', type: 'numeric', precision: 5, scale: 2 })
  public weightValue!: number

  @Column({ name: 'weight_unit', type: 'varchar', length: 20 })
  public weightUnit!: WeightUnitType

  @Column({ name: 'body_mass_index', type: 'numeric', precision: 5, scale: 2 })
  public bodyMassIndex!: number

  @Column({ name: 'weight_note', type: 'varchar', length: 150 })
  public weightNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
