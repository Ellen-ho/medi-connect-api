import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { GlycatedHemoglobinUnitType } from '../../../domain/record/GlycatedHemoglobinRecord'
import { PatientEntity } from '../patient/PatientEntity'

@Entity('glycated_hemoglobin_records')
export class GlycatedHemoglobinRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'glycated_hemoglobin_date' })
  public glycatedHemoglobinDate!: Date

  @Column({
    name: 'glycated_hemoglobin_value',
    type: 'numeric',
    precision: 3,
    scale: 2,
  })
  public glycatedHemoglobinValue!: number

  @Column({ name: 'glycated_hemoglobin_unit', type: 'varchar', length: 20 })
  public glycatedHemoglobinUnit!: GlycatedHemoglobinUnitType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
