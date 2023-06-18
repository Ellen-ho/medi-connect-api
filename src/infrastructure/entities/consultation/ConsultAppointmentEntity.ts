import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
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
    length: 150,
    default: ConsultAppointmentStatusType.UPCOMING,
  })
  public status!: ConsultAppointmentStatusType

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt?: Date

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  public patient!: PatientEntity

  @Column({ name: 'meeting_link', type: 'text', nullable: true })
  public meetingLink!: string | null

  @Column({ name: 'patient_id' })
  @RelationId(
    (consultAppointment: ConsultAppointmentEntity) => consultAppointment.patient
  )
  public patientId!: string

  @ManyToOne(
    () => DoctorTimeSlotEntity,
    (doctorTimeSlot) => doctorTimeSlot.id,
    {
      cascade: true,
    }
  )
  @JoinColumn({ name: 'doctor_time_slot_id' })
  public doctorTimeSlot!: DoctorTimeSlotEntity
}
