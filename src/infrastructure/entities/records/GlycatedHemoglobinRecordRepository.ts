import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { GlycatedHemoglobinRecordEntity } from './GlycatedHemoglobinRecordEntity'

import { GlycatedHemoglobinRecord } from '../../../domain/record/GlycatedHemoglobinRecord'
import { GlycatedHemoglobinRecordMapper } from './GlycatedHemoglobinRecordMapper'
import { IGlycatedHemoglobinRecordRepository } from '../../../domain/record/interfaces/repositories/IGlycatedHemoglobinRecordRepository'

export class GlycatedHemoglobinRecordRepository
  extends BaseRepository<
    GlycatedHemoglobinRecordEntity,
    GlycatedHemoglobinRecord
  >
  implements IGlycatedHemoglobinRecordRepository
{
  constructor(dataSource: DataSource) {
    super(
      GlycatedHemoglobinRecordEntity,
      new GlycatedHemoglobinRecordMapper(),
      dataSource
    )
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<GlycatedHemoglobinRecord | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('glycated_hemoglobin_records')
        .leftJoinAndSelect('glycated_hemoglobin_records.patient', 'patient')
        .where('glycated_hemoglobin_records.id = :recordId', {
          recordId,
        })
        .andWhere('patients.id = :patientId', { patientId })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByIdAndPatientId error')
    }
  }
}
