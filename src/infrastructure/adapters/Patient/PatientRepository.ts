import { DataSource, Repository } from 'typeorm'
import { IPatientRepository } from '../../../domain/patient/interfaces/repositories/IPatientRepository'
import { BaseRepository } from '../BaseRepository'
import { PatientEntity } from './PatientEntity'
import { Patient } from '../../../domain/patient/Patient'
import { PatientMapper } from './PatientMapper'

export class PatientRepository
  extends BaseRepository<PatientEntity>
  implements IPatientRepository
{
  private readonly repo: Repository<PatientEntity>
  constructor(dataSource: DataSource) {
    super(PatientEntity, dataSource)
    this.repo = this.getRepo()
  }

  public async findById(id: string): Promise<Patient | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? PatientMapper.toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
    }
  }

  public async save(patient: Patient): Promise<void> {
    try {
      await this.getRepo().save(patient)
    } catch (e) {
      throw new Error('repository findByEmail error')
    }
  }
}
