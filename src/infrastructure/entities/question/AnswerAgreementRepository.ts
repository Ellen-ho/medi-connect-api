import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { AnswerAgreementEntity } from './AnswerAgreementEntity'
import { AnswerAgreement } from '../../../domain/question/AnswerAgreement'
import { AnswerAgreementMapper } from './AnswerAgreementMapper'
import { IAnswerAgreementRepository } from '../../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

export class AnswerAgreementRepository
  extends BaseRepository<AnswerAgreementEntity, AnswerAgreement>
  implements IAnswerAgreementRepository
{
  constructor(dataSource: DataSource) {
    super(AnswerAgreementEntity, new AnswerAgreementMapper(), dataSource)
  }

  public async findById(id: string): Promise<AnswerAgreement | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['answer', 'agreedDoctor'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findById error',
        e as Error
      )
    }
  }

  public async findAllByAnswerId(
    answerId: string,
    take?: number
  ): Promise<AnswerAgreement[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          answer: {
            id: answerId,
          },
        },
        take,
        order: {
          createdAt: 'DESC',
        },
        relations: ['answer'],
      })
      return entities.map((entity) => this.getMapper().toDomainModel(entity))
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findAllByAnswerId error',
        e as Error
      )
    }
  }

  public async countsByAnswerId(answerId: string): Promise<number> {
    try {
      const rawCounts = await this.getQuery<Array<{ count: number }>>(
        `
        SELECT COUNT(*) 
        FROM answer_agreements
        WHERE answer_agreements.patient_question_answer_id = $1
        AND answer_agreements.deleted_at IS NULL
        `,
        [answerId]
      )

      return rawCounts[0].count
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository countsByAnswerId error',
        e as Error
      )
    }
  }

  public async findAgreedDoctorAvatarsByAnswerId(
    answerId: string
  ): Promise<Array<string | null>> {
    try {
      const rawDoctorAvatars = await this.getQuery<
        Array<{
          avatar: string | null
        }>
      >(
        `
        SELECT doctors.avatar 
        FROM answer_agreements
        LEFT JOIN doctors ON answer_agreements.agreed_doctor_id = doctors.id
        WHERE answer_agreements.patient_question_answer_id = $1
        AND answer_agreements.deleted_at IS NULL
        ORDER BY answer_agreements.created_at DESC
    `,
        [answerId]
      )

      return rawDoctorAvatars.map((rawItem) => rawItem.avatar)
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findAgreedDoctorAvatarsByAnswerId error',
        e as Error
      )
    }
  }

  public async findByAnswerIdAndAgreedDoctorId(
    answerId: string,
    agreedDoctorId: string
  ): Promise<AnswerAgreement | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          answer: {
            id: answerId,
          },
          agreedDoctor: {
            id: agreedDoctorId,
          },
        },
        relations: ['answer', 'agreedDoctor'],
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findByAnswerIdAndAgreedDoctorId error',
        e as Error
      )
    }
  }

  public async delete(
    agreement: AnswerAgreement,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(agreement)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `AnswerAgreementRepository delete error: ${(e as Error).message}`,
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
        .createQueryBuilder('answer_agreements')
        .softDelete()
        .where('patient_question_answer_id = :answerId', { answerId })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository deleteAllByAnswerId error',
        e as Error
      )
    }
  }

  public async findByIdAndAgreedDoctorId(
    answerAgreementId: string,
    agreedDoctorId: string
  ): Promise<AnswerAgreement | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: answerAgreementId,
          agreedDoctor: {
            id: agreedDoctorId,
          },
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findByIdAndAgreedDoctorId error',
        e as Error
      )
    }
  }

  public async findByDoctorId(doctorId: string): Promise<AnswerAgreement[]> {
    try {
      const entities = await this.getRepo().find({
        where: {
          agreedDoctor: {
            id: doctorId,
          },
        },
        relations: ['answer'],
      })
      return entities.map((entity) => this.getMapper().toDomainModel(entity))
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findByDoctorId error',
        e as Error
      )
    }
  }

  public async findByAnswerId(answerId: string): Promise<
    Array<{
      comment: string | null
      agreedDoctorId: string
      agreedDoctorFirstName: string
      agreedDoctorLastName: string
      createdAt: Date
    }>
  > {
    try {
      const agreementData = await this.getRepo()
        .createQueryBuilder('answer_agreement')
        .select([
          'answer_agreement.comment',
          'answer_agreement.agreed_doctor_id',
        ])
        .select([
          'answer_agreement.comment AS "comment"',
          'answer_agreement.agreed_doctor_id AS "agreedDoctorId"',
          'agreedDoctor.first_name AS "agreedDoctorFirstName"',
          'agreedDoctor.last_name AS "agreedDoctorLastName"',
          'answer_agreement.created_at AS "createdAt"',
        ])
        .leftJoin('answer_agreement.agreedDoctor', 'agreedDoctor')
        .where('answer_agreement.patient_question_answer_id = :answerId', {
          answerId,
        })
        .getRawMany()

      if (agreementData.length === 0) {
        return []
      }

      const result = agreementData.map((data) => {
        return {
          comment: data.comment,
          agreedDoctorId: data.agreedDoctorId,
          agreedDoctorFirstName: data.agreedDoctorFirstName,
          agreedDoctorLastName: data.agreedDoctorLastName,
          createdAt: data.createdAt,
        }
      })

      return result
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findByAnswerId error',
        e as Error
      )
    }
  }
}
