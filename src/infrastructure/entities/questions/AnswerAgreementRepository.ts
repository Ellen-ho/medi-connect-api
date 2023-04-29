import { DataSource } from 'typeorm'
import { BaseRepository } from '../BaseRepository'
import { AnswerAgreementEntity } from './AnswerAgreementEntity'
import { AnswerAgreement } from '../../../domain/question/AnswerAgreement'
import { AnswerAgreementMapper } from './AnswerAgreementMapper'
import { IAnswerAgreementRepository } from '../../../domain/question/interfaces/repositories/IAnswerAgreementRepository'

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
      throw new Error('repository findById error')
    }
  }

  public async countsByAnswerId(answerId: string): Promise<number> {
    try {
      const counts = await this.getRepo().count({
        where: {
          answer: {
            id: answerId,
          },
        },
        relations: ['answer', 'agreedDoctor'],
      })
      console.table({ counts })
      return counts
    } catch (e) {
      throw new Error('repository countsByAnswerId error')
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
      throw new Error('repository countsByAnswerId error')
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
      throw new Error('repository countsByAnswerId error')
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
      throw new Error('repository deleteByAnswerId error')
    }
  }

  public async findByIdAndAgreedDoctorId(
    answerAgreementId: string,
    agreedDoctorId: string
  ): Promise<AnswerAgreement | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('answer_agreements')
        .leftJoinAndSelect('answer_agreements.agreedDoctor', 'agreedDoctor')
        .where('answer_agreements.id = :answerAgreementId', {
          answerAgreementId,
        })
        .andWhere('agreedDoctors.id = :agreedDoctorId', {
          agreedDoctorId,
        })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByIdAndAgreedDoctorId error')
    }
  }
}
