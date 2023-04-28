import { DataSource } from 'typeorm'
import { AnswerAppreciation } from '../../../domain/question/AnswerAppreciation'
import { BaseRepository } from '../BaseRepository'
import { AnswerAppreciationEntity } from './AnswerAppreciationEntity'
import { AnswerAppreciationMapper } from './AnswerAppreciationMapper'
import { IAnswerAppreciationRepository } from '../../../domain/question/interfaces/repositories/IAnswerAppreciationtRepository'

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
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findById error')
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
      throw new Error('repository countByAnswerId error')
    }
  }

  public async findByIdAndPatientId(
    answerAppreciationId: string,
    patientId: string
  ): Promise<AnswerAppreciation | null> {
    try {
      const entity = await this.getRepo()
        .createQueryBuilder('answer_apprieciations')
        .leftJoinAndSelect('answer_apprieciations.patient', 'patient')
        .where('answer_apprieciations.id = :answerAppreciationId', {
          answerAppreciationId,
        })
        .andWhere('patients.id = :patientId', { patientId })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new Error('repository findByIdAndPatientId error')
    }
  }

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('answer_apprieciations')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new Error('repository deleteById error')
    }
  }

  public async deleteAllByAnswerId(answerId: string): Promise<void> {
    try {
      await this.getRepo()
        .createQueryBuilder('answer_apprieciations')
        .softDelete()
        .where('answer_id = :answerId', { answerId })
        .execute()
    } catch (e) {
      throw new Error('repository deleteByAnswerId error')
    }
  }
}
