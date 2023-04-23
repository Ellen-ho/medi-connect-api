import { DataSource } from 'typeorm'
import { IPatientRepository } from '../../../domain/patient/interfaces/repositories/IPatientRepository'
import { BaseRepository } from '../BaseRepository'

import { Patient } from '../../../domain/patient/Patient'
import { PatientEntity } from './PatientEntity'
import { PatientMapper } from './PatientMapper'

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
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }
}
