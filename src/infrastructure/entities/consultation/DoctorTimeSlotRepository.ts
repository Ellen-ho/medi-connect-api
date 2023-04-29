import { DataSource } from 'typeorm'
import { IDoctorTimeSlotRepository } from '../../../domain/consultation/interfaces/repositories/IDoctorTimeSlotRepository'
import { BaseRepository } from '../BaseRepository'
import { DoctorTimeSlotEntity } from './DoctorTimeSlotEntity'
import { DoctorTimeSlotMapper } from './DoctorTimeSlotMapper'
import { DoctorTimeSlot } from '../../../domain/consultation/DoctorTimeSlot'

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
      throw new Error('repository findById error')
    }
  }
}
