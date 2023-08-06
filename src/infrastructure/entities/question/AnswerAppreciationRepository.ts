import { DataSource } from 'typeorm'
import { AnswerAppreciation } from '../../../domain/question/AnswerAppreciation'
import { BaseRepository } from '../../database/BaseRepository'
import { AnswerAppreciationEntity } from './AnswerAppreciationEntity'
import { AnswerAppreciationMapper } from './AnswerAppreciationMapper'
import { IAnswerAppreciationRepository } from '../../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

export class AnswerAppreciationRepository
  extends BaseRepository<AnswerAppreciationEntity, AnswerAppreciation>
  implements IAnswerAppreciationRepository
{
  constructor(dataSource: DataSource) {
    super(AnswerAppreciationEntity, new AnswerAppreciationMapper(), dataSource)
  }

  public async findById(id: string): Promise<AnswerAppreciation | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['user'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository findById error',
        e as Error
      )
    }
  }

  public async countByAnswerId(answerId: string): Promise<number> {
    try {
      const counts = await this.getRepo().count({
        where: {
          answer: {
            id: answerId,
          },
        },
        relations: ['answer'],
      })
      return counts
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository countByAnswerId error',
        e as Error
      )
    }
  }

  public async findByIdAndPatientId(
    answerAppreciationId: string,
    patientId: string
  ): Promise<AnswerAppreciation | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('answer_appreciations')
        .leftJoinAndSelect('answer_appreciations.patient', 'patient')
        .where('answer_appreciations.id = :answerAppreciationId', {
          answerAppreciationId,
        })
        .andWhere('patient.id = :patientId', { patientId })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async delete(
    appreciation: AnswerAppreciation,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(appreciation)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `AnswerAppreciationRepository delete error: ${(e as Error).message}`,
        e as Error
      )
    }
  }

  public async deleteAllByAnswerId(
    answerId: string,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      await executor
        .createQueryBuilder('answer_appreciations')
        .softDelete()
        .where('answer_id = :answerId', { answerId })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository deleteAllByAnswerId error',
        e as Error
      )
    }
  }

  public async findByAnswerIdAndPatientId(
    answerId: string,
    patientId: string
  ): Promise<AnswerAppreciation | null> {
    try {
      const appreciationEntity = await this.getRepo()
        .createQueryBuilder('answer_appreciations')
        .leftJoinAndSelect('answer_appreciations.patient', 'patient')
        .leftJoinAndSelect('answer_appreciations.answer', 'answer')
        .leftJoinAndSelect('patient.user', 'user')
        .where('answer_appreciations.answer_id = :answerId', { answerId })
        .andWhere('answer_appreciations.patient_id = :patientId', { patientId })
        .andWhere('answer_appreciations.deleted_at IS NULL')
        .getOne()

      return appreciationEntity != null
        ? this.getMapper().toDomainModel(appreciationEntity)
        : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository findByAnswerIdAndPatientId error',
        e as Error
      )
    }
  }

  public async findByAnswerId(answerId: string): Promise<
    Array<{
      content: string | null
      patientId: string
      patientAge: number
      createdAt: Date
    }>
  > {
    try {
      const appreciationData = await this.getRepo()
        .createQueryBuilder('answer_appreciation')
        .select([
          'answer_appreciation.content AS "content"',
          'answer_appreciation.patient_id AS "patientId"',
          'patient.birth_date AS "patientBirthDate"',
          'answer_appreciation.created_at AS "createdAt"',
        ])
        .leftJoin('answer_appreciation.patient', 'patient')
        .where('answer_appreciation.answer_id = :answerId', {
          answerId,
        })
        .getRawMany()

      if (appreciationData.length === 0) {
        return []
      }

      const today = new Date()
      const appreciationDataWithPatientAge = appreciationData.map((data) => {
        const ageDiff = today.getTime() - data.patientBirthDate.getTime()
        const ageDate = new Date(ageDiff)
        const patientAge = Math.abs(ageDate.getUTCFullYear() - 1970)
        return {
          content: data.content,
          patientId: data.patientId,
          patientAge,
          createdAt: data.createdAt,
        }
      })

      return appreciationDataWithPatientAge
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository findByAnswerId error',
        e as Error
      )
    }
  }
}
