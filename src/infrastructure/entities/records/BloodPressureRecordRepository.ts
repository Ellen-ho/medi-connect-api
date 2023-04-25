import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { BloodPressureRecordEntity } from './BloodPressureRecordEntity'
import { IBloodPressureRecordRepository } from '../../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { BloodPressureRecord } from '../../../domain/record/BloodPressureRecord'
import { BloodPressureRecordMapper } from './BloodPressureRecordMapper'

export class BloodPressureRecordRepository
  extends BaseRepository<BloodPressureRecordEntity, BloodPressureRecord>
  implements IBloodPressureRecordRepository
{
  constructor(dataSource: DataSource) {
    super(
      BloodPressureRecordEntity,
      new BloodPressureRecordMapper(),
      dataSource
    )
  }

  public async findByIdAndPatientId(
    recordId: string,
    patientId: string
  ): Promise<BloodPressureRecord | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('blood_pressure_records')
        .leftJoinAndSelect('blood_pressure_records.patient', 'patient')
        .where('blood_pressure_records.id = :recordId', {
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
