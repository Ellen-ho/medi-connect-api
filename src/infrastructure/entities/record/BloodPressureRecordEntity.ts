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

@Entity('blood_pressure_records')
export class BloodPressureRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ name: 'blood_pressure_date' })
  public bloodPressureDate!: Date

  @Column({ name: 'systolic_blood_pressure', type: 'int' })
  public systolicBloodPressure!: number

  @Column({ name: 'diastolic_blood_pressure', type: 'int' })
  public diastolicBloodPressure!: number

  @Column({ name: 'heart_beat', type: 'int' })
  public heartBeat!: number

  @Column({
    name: 'blood_pressure_note',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  public bloodPressureNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId(
    (bloodPressureRecord: BloodPressureRecordEntity) =>
      bloodPressureRecord.patient
  )
  public patientId!: string
}
