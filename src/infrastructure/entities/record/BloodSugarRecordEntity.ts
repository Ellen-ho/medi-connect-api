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
import { BloodSugarType } from '../../../domain/record/BloodSugarRecord'

@Entity('blood_sugar_records')
export class BloodSugarRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'blood_sugar_date' })
  public bloodSugarDate!: Date

  @Column({
    name: 'blood_sugar_value',
    type: 'numeric',
    precision: 5,
    scale: 2,
  })
  public bloodSugarValue!: number

  @Column({ name: 'blood_sugar_type', type: 'varchar', length: 150 })
  public bloodSugarType!: BloodSugarType

  @Column({ name: 'blood_sugar_note', type: 'varchar', length: 250 })
  public bloodSugarNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId(
    (bloodSugarRecord: BloodSugarRecordEntity) => bloodSugarRecord.patient
  )
  public patientId!: string
}
