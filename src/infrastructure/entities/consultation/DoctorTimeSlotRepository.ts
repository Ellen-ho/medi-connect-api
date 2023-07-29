import { Between, DataSource } from 'typeorm'
import { IDoctorTimeSlotRepository } from '../../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { DoctorTimeSlotEntity } from './DoctorTimeSlotEntity'
import { DoctorTimeSlotMapper } from './DoctorTimeSlotMapper'
import { DoctorTimeSlot } from '../../../domain/consultation/DoctorTimeSlot'
import { BaseRepository } from '../../database/BaseRepository'
import { RepositoryError } from '../../error/RepositoryError'
import dayjs from 'dayjs'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

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
    id: string,
    doctorId: string
  ): Promise<DoctorTimeSlot | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id,
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

  public async findByDoctorIdAndDate(
    doctorId: string,
    startTime: string,
    endTime: string
  ): Promise<{
    doctorId: string
    timeSlots: Array<{
      id: string
      startAt: Date
      endAt: Date
      isAvailable: boolean
    }>
  }> {
    try {
      const startDate = dayjs(startTime).startOf('day').toDate()
      const endDate = dayjs(endTime).endOf('day').toDate()
      console.table({ startDate })
      const entities = await this.getRepo().find({
        where: {
          doctor: { id: doctorId },
          startAt: Between(startDate, endDate),
        },
        relations: ['doctor'],
      })
      if (entities.length === 0) {
        return {
          doctorId,
          timeSlots: [],
        }
      }
      return {
        doctorId,
        timeSlots: entities.map((entity) => ({
          id: entity.id,
          startAt: entity.startAt,
          endAt: entity.endAt,
          isAvailable: entity.availability,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'DoctorTimeSlotRepository findByDoctorIdAndDate error',
        e as Error
      )
    }
  }

  public async deleteById(
    id: string,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      console.log('Executing delete query for id:', id)
      await executor
        .createQueryBuilder('doctor_time_slots')
        .softDelete()
        .where('id = :id', { id })
        .execute()
      console.log('Delete query executed successfully.')
    } catch (e) {
      console.error('Error executing delete query:', e)
      throw new RepositoryError(
        'DoctorTimeSlotRepository deleteById error',
        e as Error
      )
    }
  }
}
