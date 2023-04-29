import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import {
  DoctorStatusType,
  PatientStatusType,
} from '../../../domain/consultation/ConsultAppointment'
import { PatientEntity } from '../patient/PatientEntity'
import { DoctorTimeSlotEntity } from './DoctorTimeSlotEntity'

@Entity('consult_appointments')
export class ConsultAppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'doctor_status',
    type: 'varchar',
    length: 150,
  })
  public doctorStatus!: DoctorStatusType

  @Column({
    name: 'patient_status',
    type: 'varchar',
    length: 150,
  })
  public patientStatus!: PatientStatusType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @ManyToOne(() => DoctorTimeSlotEntity, (doctorTimeSlot) => doctorTimeSlot.id)
  @JoinColumn({ name: 'doctor_time_slot_id' })
  public doctorTimeSlot!: DoctorTimeSlotEntity
}
