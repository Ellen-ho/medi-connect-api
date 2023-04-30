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
}
