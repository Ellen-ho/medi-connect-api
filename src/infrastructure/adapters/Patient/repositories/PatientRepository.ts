import { DataSource, Repository } from 'typeorm'
import { IPatientRepository } from '../../../../domain/patient/interfaces/repositories/IPatientRepository'
import { Patient } from '../../../../domain/patient/models/Patient'
import { BaseRepository } from '../../BaseRepository'
import { PatientEntity } from '../entities/Patient'

export class PatientRepository
  extends BaseRepository<PatientEntity>
  implements IPatientRepository
{
  private readonly repo: Repository<PatientEntity>
  constructor(dataSource: DataSource) {
    super(PatientEntity, dataSource)
    this.repo = this.getRepo()
  }
}  