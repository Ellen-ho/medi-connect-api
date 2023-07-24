import { DataSource } from 'typeorm'

import { BaseRepository } from '../../database/BaseRepository'
import { DoctorEntity } from './DoctorEntity'
import { IDoctorRepository } from '../../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { Doctor, GenderType } from '../../../domain/doctor/Doctor'
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
  ): Promise<{
    data: Array<{
      id: string
      avatar: string
      firstName: string
      lastName: string
      specialties: MedicalSpecialtyType[]
      gender: GenderType
    }>
    counts: number
  }> {
    try {
      const entities = await this.getQuery<
        Array<{
          id: string
          avatar: string
          first_name: string
          last_name: string
          specialties: MedicalSpecialtyType[]
          gender: GenderType
          counts: number
        }>
      >(
        `
        SELECT 
          doctors.id,
          doctors.avatar,
          doctors.first_name,
          doctors.last_name,
          doctors.specialties,
          doctors.gender,
          COUNT(*) OVER() AS counts
        FROM doctors
        LEFT JOIN users ON doctors.user_id = users.id
        WHERE ($1::TEXT IS NULL OR specialties ? $1::TEXT)
        LIMIT $2
        OFFSET $3
      `,
        [specialty, limit, offset]
      )

      const totalCounts = entities.length > 0 ? entities[0].counts : 0

      const mappedData = entities.map((entity) => ({
        id: entity.id,
        avatar: entity.avatar,
        firstName: entity.first_name,
        lastName: entity.last_name,
        specialties: entity.specialties,
        gender: entity.gender,
      }))

      return { data: mappedData, counts: totalCounts }
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findAndCountBySpecialties error',
        e as Error
      )
    }
  }

  //       const totalCounts = entities.length === 0 ? 0 : entities[0].counts

  //       const doctors: Doctor[] = entities.map((entity: DoctorEntity) =>
  //         this.getMapper().toDomainModel(entity)
  //       )

  //       return { data: doctors, counts: totalCounts }
  //     } catch (e) {
  //       throw new RepositoryError(
  //         'DoctorRepository findAndCountBySpecialties error',
  //         e as Error
  //       )
  //     }
  //   }
  // }
}
