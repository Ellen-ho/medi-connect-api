import { DataSource } from 'typeorm'

import { BaseRepository } from '../../database/BaseRepository'
import { DoctorEntity } from './DoctorEntity'
import { IDoctorRepository } from '../../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { Doctor } from '../../../domain/doctor/Doctor'
import { DoctorMapper } from './DoctorMapper'
import { RepositoryError } from '../../error/RepositoryError'
import { MedicalSpecialtyType } from '../../../domain/question/PatientQuestion'

export class DoctorRepository
  extends BaseRepository<DoctorEntity, Doctor>
  implements IDoctorRepository
{
  constructor(dataSource: DataSource) {
    super(DoctorEntity, new DoctorMapper(), dataSource)
  }

  public async findByDoctorId(doctorId: string): Promise<Doctor | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id: doctorId },
        relations: ['user'],
      })

      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findByDoctorId error',
        e as Error
      )
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
      throw new RepositoryError(
        'DoctorRepository findByUserId error',
        e as Error
      )
    }
  }

  public async findById(id: string): Promise<Doctor | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError('DoctorRepository findById error', e as Error)
    }
  }

  public async findAndCountBySpecialties(
    specialties: MedicalSpecialtyType[],
    limit: number,
    offset: number
  ): Promise<{ data: Doctor[]; count: number }> {
    try {
      const specialtiesValues = specialties
        .map((specialty) => `'${specialty}'`)
        .join(',')

      const rawData = await this.getQuery<{
        data: DoctorEntity[]
        count: string
      }>(
        `
        SELECT *
        FROM doctors
        WHERE specialties @> ARRAY[${specialtiesValues}]::varchar[]
        LIMIT $1
        OFFSET $2
      `,
        [limit, offset]
      )
      const doctors: Doctor[] = rawData.data.map((entity) =>
        this.getMapper().toDomainModel(entity)
      )
      const result = { data: doctors, count: parseInt(rawData.count, 10) }
      return result
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findAndCountBySpecialties error',
        e as Error
      )
    }
  }
}
