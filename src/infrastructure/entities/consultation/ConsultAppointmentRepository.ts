import { DataSource } from 'typeorm'
import { ConsultAppointment } from '../../../domain/consultation/ConsultAppointment'
import { IConsultAppointmentRepository } from '../../../domain/consultation/interfaces/repositories/IConsultAppointmentRepository'
import { BaseRepository } from '../../database/BaseRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { ConsultAppointmentEntity } from './ConsultAppointmentEntity'
import { ConsultAppointmentMapper } from './ConsultAppointmentMapper'

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
      const entity = await this.getRepo()
        .createQueryBuilder('consult_appointments')
        .leftJoinAndSelect('consult_appointments.patient', 'patient')
        .where('consult_appointmentss.id = :consultAppointmentId', {
          consultAppointmentId,
        })
        .andWhere('patients.id = :patientId', { patientId })
        .getOne()
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
        .createQueryBuilder('consult_appointmens')
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
}
