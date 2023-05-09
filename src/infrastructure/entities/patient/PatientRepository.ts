import { DataSource } from 'typeorm'
import { IPatientRepository } from '../../../domain/patient/interfaces/repositories/IPatientRepository'
import { BaseRepository } from '../../database/BaseRepository'

import { Patient } from '../../../domain/patient/Patient'
import { PatientEntity } from './PatientEntity'
import { PatientMapper } from './PatientMapper'
import { RepositoryError } from '../../error/RepositoryError'

export class PatientRepository
  extends BaseRepository<PatientEntity, Patient>
  implements IPatientRepository
{
  constructor(dataSource: DataSource) {
    super(PatientEntity, new PatientMapper(), dataSource)
  }

  public async findById(id: string): Promise<Patient | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('PatientRepository findById error', e as Error)
    }
  }

  public async findByUserId(userId: string): Promise<Patient | null> {
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
      throw new RepositoryError(
        'PatientRepository findByUserId error',
        e as Error
      )
    }
  }
}
