import { DataSource } from 'typeorm'
import { IDoctorTimeSlotRepository } from '../../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { DoctorTimeSlotEntity } from './DoctorTimeSlotEntity'
import { DoctorTimeSlotMapper } from './DoctorTimeSlotMapper'
import { DoctorTimeSlot } from '../../../domain/consultation/DoctorTimeSlot'
import { BaseRepository } from '../../database/BaseRepository'
import { RepositoryError } from '../../error/RepositoryError'

export class DoctorTimeSlotRepository
  extends BaseRepository<DoctorTimeSlotEntity, DoctorTimeSlot>
  implements IDoctorTimeSlotRepository
{
  constructor(dataSource: DataSource) {
    super(DoctorTimeSlotEntity, new DoctorTimeSlotMapper(), dataSource)
  }

  public async findById(id: string): Promise<DoctorTimeSlot | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'DoctorTimeSlotRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndDoctorId(
    doctorTimeSlotId: string,
    doctorId: string
  ): Promise<DoctorTimeSlot | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: doctorTimeSlotId,
          doctor: { id: doctorId },
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'DoctorTimeSlotRepository findByIdAndDoctorId error',
        e as Error
      )
    }
  }

  public async findByStartAtAndDoctorId(
    startAt: Date,
    doctorId: string
  ): Promise<DoctorTimeSlot | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          startAt,
          doctor: { id: doctorId },
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'DoctorTimeSlotRepository findByStartAtAndDoctorId error',
        e as Error
      )
    }
  }
}
