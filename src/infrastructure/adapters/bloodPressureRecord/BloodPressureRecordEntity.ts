import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PatientEntity } from '../Patient/PatientEntity'

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

  @Column({ name: 'blood_pressure_note', type: 'varchar', length: 150 })
  public bloodPressureNote!: string | null

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity, (patient) => patient.bloodPressureRecords)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity
}
