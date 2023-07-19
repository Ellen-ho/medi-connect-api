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
    limit: number,
    offset: number,
    specialty?: MedicalSpecialtyType
  ): Promise<{ data: Doctor[]; counts: number }> {
    try {
      const entities = await this.getQuery<
        Array<DoctorEntity & { counts: number }>
      >(
        `
          SELECT 
            doctors.*, 
            ROW_TO_JSON(users.*) AS user,
            COUNT(*) OVER() AS counts
          FROM doctors
          LEFT JOIN users ON doctors.user_id = users.id
          WHERE ($1::TEXT IS NULL OR specialties ? $1::TEXT)
          LIMIT $2
          OFFSET $3
        `,
        [specialty, limit, offset]
      )

      const totalCounts = entities.length === 0 ? 0 : entities[0].counts

      const doctors: Doctor[] = entities.map((entity: DoctorEntity) =>
        this.getMapper().toDomainModel(entity)
      )

      return { data: doctors, counts: totalCounts }
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findAndCountBySpecialties error',
        e as Error
      )
    }
  }
}
