import { DataSource, In } from 'typeorm'
import {
  ConsultAppointment,
  ConsultAppointmentStatusType,
} from '../../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { BaseRepository } from '../../database/BaseRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { ConsultAppointmentEntity } from './ConsultAppointmentEntity'
import { ConsultAppointmentMapper } from './ConsultAppointmentMapper'
import { MedicalSpecialtyType } from '../../../domain/question/PatientQuestion'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'
import { TimeSlotType } from 'domain/consultation/DoctorTimeSlot'

export class ConsultAppointmentRepository
  extends BaseRepository<ConsultAppointmentEntity, ConsultAppointment>
  implements IConsultAppointmentRepository
{
  constructor(dataSource: DataSource) {
    super(ConsultAppointmentEntity, new ConsultAppointmentMapper(), dataSource)
  }

  public async findById(id: string): Promise<ConsultAppointment | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentEntity findById error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    consultAppointmentId: string,
    patientId: string
  ): Promise<ConsultAppointment | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: consultAppointmentId,
          patient: { id: patientId },
        },
        relations: ['doctorTimeSlot'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async delete(
    appointment: ConsultAppointment,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(appointment)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `ConsultAppointmentRepository delete error: ${(e as Error).message}`,
        e as Error
      )
    }
  }

  public async findByPatientIdAndStatusWithinDateRange(
    patientId: string,
    status: ConsultAppointmentStatusType[],
    startDate: Date,
    endDate: Date,
    type?: TimeSlotType
  ): Promise<
    Array<{
      appointmentId: string
      patientId: string
      status: ConsultAppointmentStatusType
      doctorTimeSlot: {
        startAt: Date
        endAt: Date
        type: TimeSlotType
      }
      doctor: {
        firstName: string
        lastName: string
        specialties: MedicalSpecialtyType[]
        avatar: string | null
      }
      meetingLink: string | null
      cancelAvailability: boolean
    }>
  > {
    try {
      const rawAppointments = await this.getQuery<
        Array<{
          appointment_id: string
          status: ConsultAppointmentStatusType
          patient_id: string
          first_name: string
          last_name: string
          specialties: MedicalSpecialtyType[]
          avatar: string | null
          start_at: Date
          end_at: Date
          type: TimeSlotType
          meeting_link: string | null
          cacel_availability: boolean
        }>
      >(
        `
        SELECT
          consult_appointments.patient_id,
          consult_appointments.id As "appointment_id",
          consult_appointments.status,
          consult_appointments.meeting_link,
          doctors.first_name,
          doctors.last_name,
          doctors.specialties,
          doctors.avatar,
          doctor_time_slots.start_at,
          doctor_time_slots.end_at,
          doctor_time_slots.type
        FROM consult_appointments
        INNER JOIN doctor_time_slots ON consult_appointments.doctor_time_slot_id = doctor_time_slots.id
        INNER JOIN doctors ON doctor_time_slots.doctor_id = doctors.id
        WHERE
          consult_appointments.patient_id = $1
          AND consult_appointments.status = ANY ($2)
          AND doctor_time_slots.start_at >= $3
          AND doctor_time_slots.end_at <= $4
          ${type ? `AND doctor_time_slots.type = $5` : ''}
        ORDER BY doctor_time_slots.start_at ASC
        `,
        type
          ? [patientId, status, startDate, endDate, type]
          : [patientId, status, startDate, endDate]
      )
      return rawAppointments.map((rawItem) => ({
        patientId: rawItem.patient_id,
        appointmentId: rawItem.appointment_id,
        status: rawItem.status,
        doctorTimeSlot: {
          startAt: rawItem.start_at,
          endAt: rawItem.end_at,
          type: rawItem.type,
        },
        doctor: {
          firstName: rawItem.first_name,
          lastName: rawItem.last_name,
          specialties: rawItem.specialties,
          avatar: rawItem.avatar,
        },
        meetingLink: rawItem.meeting_link,
        cancelAvailability: rawItem.cacel_availability,
      }))
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository findByPatientIdAndStatusWithinDateRange error',
        e as Error
      )
    }
  }

  public async findByDoctorIdAndStatusWithinDateRange(
    doctorId: string,
    status: ConsultAppointmentStatusType[],
    startDate: Date,
    endDate: Date,
    type?: TimeSlotType
  ): Promise<
    Array<{
      appointmentId: string
      status: ConsultAppointmentStatusType
      doctorTimeSlot: {
        doctorId: string
        startAt: Date
        endAt: Date
        type: TimeSlotType
      }
      patient: {
        id: string
        firstName: string
        lastName: string
        avatar: string | null
      }
      meetingLink: string | null
    }>
  > {
    try {
      const rawAppointments = await this.getQuery<
        Array<{
          appointment_id: string
          status: ConsultAppointmentStatusType
          doctor_id: string
          id: string
          first_name: string
          last_name: string
          avatar: string
          start_at: Date
          end_at: Date
          type: TimeSlotType
          meeting_link: string | null
        }>
      >(
        `
        SELECT
          doctor_time_slots.doctor_id AS "doctor_id",
          consult_appointments.id AS "appointment_id",
          consult_appointments.status,
          consult_appointments.meeting_link,
          doctor_time_slots.start_at AS "start_at",
          doctor_time_slots.end_at AS "end_at",
          doctor_time_slots.type AS "type",
          patients.id AS "id",
          patients.first_name AS "first_name",
          patients.last_name AS "last_name",
          patients.avatar AS "avatar"
        FROM consult_appointments
        INNER JOIN doctor_time_slots ON consult_appointments.doctor_time_slot_id = doctor_time_slots.id
        INNER JOIN doctors ON doctor_time_slots.doctor_id = doctors.id
        INNER JOIN patients ON consult_appointments.patient_id = patients.id
        WHERE
          doctor_time_slots.doctor_id = $1
          AND consult_appointments.status = ANY ($2)
          AND doctor_time_slots.start_at >= $3
          AND doctor_time_slots.end_at <= $4
          ${type ? `AND doctor_time_slots.type = $5` : ''}
        ORDER BY doctor_time_slots.start_at ASC
      `,
        type
          ? [doctorId, status, startDate, endDate, type]
          : [doctorId, status, startDate, endDate]
      )

      return rawAppointments.map((rawItem) => ({
        appointmentId: rawItem.appointment_id,
        status: rawItem.status,
        doctorTimeSlot: {
          doctorId: rawItem.doctor_id,
          startAt: rawItem.start_at,
          endAt: rawItem.end_at,
          type: rawItem.type,
        },
        patient: {
          id: rawItem.id,
          firstName: rawItem.first_name,
          lastName: rawItem.last_name,
          avatar: rawItem.avatar,
        },
        meetingLink: rawItem.meeting_link,
      }))
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository findDoctorIdAndStatusWithinDateRange error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDoctorIdAndStatus(
    patientId: string,
    doctorId: string,
    status: ConsultAppointmentStatusType[]
  ): Promise<ConsultAppointment[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          patientId,
          doctorTimeSlot: {
            doctorId,
          },
          status: In(status),
        },
        relations: ['doctorTimeSlot'],
      })
      return entities.length !== 0
        ? entities.map((entity) => this.getMapper().toDomainModel(entity))
        : []
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository findByPatientIdAndDoctorIdAndStatus error',
        e as Error
      )
    }
  }
}
