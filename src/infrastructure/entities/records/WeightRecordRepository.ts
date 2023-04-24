import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { WeightRecord } from '../../../domain/record/WeightRecord'
import { IWeightRecordRepository } from '../../../domain/record/interfaces/repositories/IWeightRecordRepository'
import { WeightRecordEntity } from './WeightRecordEntity'
import { WeightRecordMapper } from './WeightRecordMapper'

export class WeightRecordRepository
  extends BaseRepository<WeightRecordEntity, WeightRecord>
  implements IWeightRecordRepository
{
  constructor(dataSource: DataSource) {
    super(WeightRecordEntity, new WeightRecordMapper(), dataSource)
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<WeightRecord | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('weight_records')
        .leftJoinAndSelect('weight_records.patient', 'patient')
        .where('weight_records.id = :recordId', {
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
