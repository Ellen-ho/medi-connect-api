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
        .andWhere('patients.id = :patientId', { patientId })
        .getOne()
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository findByIdAndPatientId error',
        e as Error
      )
    }
  }

  public async deleteById(
    id: string,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      await executor
        .createQueryBuilder('answer_appreciations')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'AnswerAppreciationRepository deleteById error',
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
}
