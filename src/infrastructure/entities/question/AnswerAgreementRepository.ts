import { DataSource } from 'typeorm'
import { BaseRepository } from '../../database/BaseRepository'
import { AnswerAgreementEntity } from './AnswerAgreementEntity'
import { AnswerAgreement } from '../../../domain/question/AnswerAgreement'
import { AnswerAgreementMapper } from './AnswerAgreementMapper'
import { IAnswerAgreementRepository } from '../../../domain/question/interfaces/repositories/IAnswerAgreementRepository'
import { RepositoryError } from '../../error/RepositoryError'

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
        relations: ['answer', 'agreedDoctor'], // if no @RalationId set, you need to add relations here
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
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository findByAnswerIdAndAgreedDoctorId error',
        e as Error
      )
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('answer_agreements')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'AnswerAgreementRepository deleteById error',
        e as Error
      )
    }
  }

  public async deleteAllByAnswerId(answerId: string): Promise<void> {
    try {
      await this.getRepo()
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
}
