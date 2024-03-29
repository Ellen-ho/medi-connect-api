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

import { PatientEntity } from '../patient/PatientEntity'

@Entity('weight_records')
export class WeightRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'weight_date' })
  public weightDate!: Date

  @Column({ name: 'weight_value_kg', type: 'numeric', precision: 5, scale: 2 })
  public weightValueKg!: number

  @Column({ name: 'body_mass_index', type: 'numeric', precision: 5, scale: 2 })
  public bodyMassIndex!: number

  @Column({ name: 'weight_note', type: 'varchar', length: 250, nullable: true })
  public weightNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId((weightRecord: WeightRecordEntity) => weightRecord.patient)
  public patientId!: string
}
