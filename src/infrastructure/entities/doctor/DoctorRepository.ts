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

  // public async findAndCountBySpecialties(
  //   limit: number,
  //   offset: number,
  //   specialties?: MedicalSpecialtyType
  // ): Promise<{ data: Doctor[]; count: number }> {
  //   try {
  // const rawData = await this.getQuery<Array<DoctorEntity>>(
  //   `
  //   SELECT *, COUNT(*) OVER() AS counts
  //   FROM doctors
  //   WHERE ($1 IS NULL OR specialties ? $1)
  //   LIMIT $2
  //   OFFSET $3
  // `,
  //   [specialties, limit, offset]
  // )
  // const queryBuilder = this.getRepo()
  //   .createQueryBuilder('doctors')
  //   .select(['doctors.*', 'COUNT(*) OVER() AS totalCounts'])
  //   .where(
  //     '(:specialties::text IS NULL OR doctors.specialties ? :specialties)',
  //     {
  //       specialties,
  //     }
  //   )
  //   .limit(limit)
  //   .offset(offset)
  // const [entities, [{ totalCounts }]] = await queryBuilder.getRawMany()

  // const [entities, totalCounts] = await Promise.all([
  //   this.getRepo().find({
  //     where: specialties
  //       ? { specialties: ArrayContains([specialties]) }
  //       : {},
  //     relations: ['users'],
  //     take: limit,
  //     skip: offset,
  //   }),
  //   this.getRepo().count({
  //     where: specialties
  //       ? { specialties: ArrayContains([specialties]) }
  //       : {},
  //   }),
  // ])

  //
  public async findAndCountBySpecialties(
    limit: number,
    offset: number,
    specialties?: MedicalSpecialtyType
  ): Promise<{ data: Doctor[]; count: number }> {
    try {
      const queryBuilder = this.getRepo()
        .createQueryBuilder('doctors')
        .take(limit)
        .skip(offset)

      if (specialties) {
        queryBuilder.andWhere('doctors.specialties @> :specialties', {
          specialties,
        })
      }

      const [entities, totalCounts] = await Promise.all([
        queryBuilder.getMany(),
        queryBuilder.getCount(),
      ])

      const doctors: Doctor[] = entities.map((entity: DoctorEntity) =>
        this.getMapper().toDomainModel(entity)
      )

      const result = { data: doctors, count: totalCounts }
      return result
    } catch (e) {
      throw new RepositoryError(
        'DoctorRepository findAndCountBySpecialties error',
        e as Error
      )
    }
  }
}
