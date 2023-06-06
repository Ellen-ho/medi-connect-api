import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'
import { ConsultAppointmentStatusType } from '../../../domain/consultation/ConsultAppointment'
import { PatientEntity } from '../patient/PatientEntity'
import { DoctorTimeSlotEntity } from './DoctorTimeSlotEntity'

@Entity('consult_appointments')
export class ConsultAppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    default: ConsultAppointmentStatusType.UPCOMING,
  })
  public status!: ConsultAppointmentStatusType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt?: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity

  @Column({ name: 'patient_id' })
  @RelationId(
    (consultAppointment: ConsultAppointmentEntity) => consultAppointment.patient
  )
  public patientId!: string

  @ManyToOne(() => DoctorTimeSlotEntity, (doctorTimeSlot) => doctorTimeSlot.id)
  @JoinColumn({ name: 'doctor_time_slot_id' })
  public doctorTimeSlot!: DoctorTimeSlotEntity
}
