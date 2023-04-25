import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { SleepRecordEntity } from './SleepRecordEntity'
import { SleepRecordMapper } from './SleepRecordMapper'
import { SleepRecord } from '../../../domain/record/SleepRecord'
import { ISleepRecordRepository } from '../../../domain/record/interfaces/repositories/ISleepRecordRepository'

export class SleepRecordRepository
  extends BaseRepository<SleepRecordEntity, SleepRecord>
  implements ISleepRecordRepository
{
  constructor(dataSource: DataSource) {
    super(SleepRecordEntity, new SleepRecordMapper(), dataSource)
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<SleepRecord | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('sleep_records')
        .leftJoinAndSelect('sleep_records.patient', 'patient')
        .where('sleep_records.id = :recordId', {
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
