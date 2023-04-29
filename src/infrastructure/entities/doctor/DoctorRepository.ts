import { DataSource } from 'typeorm'

import { BaseRepository } from '../BaseRepository'
import { DoctorEntity } from './DoctorEntity'
import { IDoctorRepository } from '../../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { Doctor } from '../../../domain/doctor/Doctor'
import { DoctorMapper } from './DoctorMapper'

export class DoctorRepository
  extends BaseRepository<DoctorEntity, Doctor>
  implements IDoctorRepository
{
  constructor(dataSource: DataSource) {
    super(DoctorEntity, new DoctorMapper(), dataSource)
  }

  public async findById(id: string): Promise<Doctor | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async findByUserId(userId: string): Promise<Doctor | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error((e as Error).message)
    }
  }
}
