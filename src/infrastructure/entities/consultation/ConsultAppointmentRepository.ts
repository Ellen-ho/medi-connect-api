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
          patient: { id: patientId }, // need to set @RelationId
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

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('consult_appointments')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository deleteById error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndStatusWithinDateRange(
    patientId: string,
    status: ConsultAppointmentStatusType[],
    startDate: Date,
    endDate: Date
  ): Promise<
    Array<{
      patientId: string
      status: ConsultAppointmentStatusType
      doctorTimeSlot: {
        startAt: Date
        endAt: Date
      }
      doctor: {
        firstName: string
        lastName: string
        specialties: MedicalSpecialtyType[]
      }
    }>
  > {
    try {
      const rawAppointments = await this.getQuery<
        Array<{
          status: ConsultAppointmentStatusType
          patient_id: string
          first_name: string
          last_name: string
          specialties: MedicalSpecialtyType[]
          start_at: Date
          end_at: Date
        }>
      >(
        `
        SELECT
          consult_appointments.patient_id,
          consult_appointments.status,
          doctors.first_name,
          doctors.last_name,
          doctors.specialties,
          doctor_time_slots.start_at,
          doctor_time_slots.end_at
        FROM consult_appointments
        INNER JOIN doctor_time_slots ON consult_appointments.doctor_time_slot_id = doctor_time_slots.id
        INNER JOIN doctors ON doctor_time_slots.doctor_id = doctors.id
        WHERE
          consult_appointments.patient_id = $1
          AND consult_appointments.status = ANY ($2)
          AND doctor_time_slots.start_at >= $3
          AND doctor_time_slots.end_at <= $4
        `,
        [patientId, status, startDate, endDate]
      )
      return rawAppointments.map((rawItem) => ({
        patientId: rawItem.patient_id,
        status: rawItem.status,
        doctorTimeSlot: {
          startAt: rawItem.start_at,
          endAt: rawItem.end_at,
        },
        doctor: {
          firstName: rawItem.first_name,
          lastName: rawItem.last_name,
          specialties: rawItem.specialties,
        },
      }))
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository findByPatientIdAndStatusWithinDateRange error',
        e as Error
      )
    }
  }

  public async findByPatientIdAndDate(
    patientId: string,
    currentDate: Date
  ): Promise<ConsultAppointment | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          patient: { id: patientId },
          createdAt: currentDate,
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

  public async findByDoctorIdAndStatusWithinDateRange(
    doctorId: string,
    status: ConsultAppointmentStatusType[],
    startDate: Date,
    endDate: Date
  ): Promise<
    Array<{
      status: ConsultAppointmentStatusType
      doctorTimeSlot: {
        doctorId: string
        startAt: Date
        endAt: Date
      }
      patient: {
        firstName: string
        lastName: string
      }
    }>
  > {
    try {
      const rawAppointments = await this.getQuery<
        Array<{
          status: ConsultAppointmentStatusType
          doctor_id: string
          first_name: string
          last_name: string
          start_at: Date
          end_at: Date
        }>
      >(
        `
        SELECT
          doctor_time_slots.doctor_id AS "doctor_id",
          consult_appointments.status,
          doctor_time_slots.start_at AS "start_at",
          doctor_time_slots.end_at AS "end_at",
          patients.first_name AS "first_name",
          patients.last_name AS "last_name"
        FROM consult_appointments
        INNER JOIN doctor_time_slots ON consult_appointments.doctor_time_slot_id = doctor_time_slots.id
        INNER JOIN doctors ON doctor_time_slots.doctor_id = doctors.id
        INNER JOIN patients ON consult_appointments.patient_id = patients.id
        WHERE
          doctor_time_slots.doctor_id = $1
          AND consult_appointments.status = ANY ($2)
          AND doctor_time_slots.start_at >= $3
          AND doctor_time_slots.end_at <= $4
      `,
        [doctorId, status, startDate, endDate]
      )
      return rawAppointments.map((rawItem) => ({
        status: rawItem.status,
        doctorTimeSlot: {
          doctorId: rawItem.doctor_id,
          startAt: rawItem.start_at,
          endAt: rawItem.end_at,
        },
        patient: {
          firstName: rawItem.first_name,
          lastName: rawItem.last_name,
        },
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
  ): Promise<ConsultAppointment[] | null> {
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
        : null
    } catch (e) {
      throw new RepositoryError(
        'ConsultAppointmentRepository findByPatientIdAndDoctorIdAndStatus error',
        e as Error
      )
    }
  }
}
