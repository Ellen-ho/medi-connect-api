import { DataSource } from 'typeorm'
import { PatientQuestion } from '../../../domain/question/PatientQuestion'
import { BaseRepository } from '../../database/BaseRepository'
import { PatientQuestionEntity } from './PatientQuestionEntity'
import { PatientQuestionMapper } from './PatientQuestionMapper'
import { IPatientQuestionRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

export class PatientQuestionRepository
  extends BaseRepository<PatientQuestionEntity, PatientQuestion>
  implements IPatientQuestionRepository
{
  constructor(dataSource: DataSource) {
    super(PatientQuestionEntity, new PatientQuestionMapper(), dataSource)
  }

  public async findById(id: string): Promise<PatientQuestion | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndAskerId(
    patientQuestionId: string,
    askerId: string
  ): Promise<PatientQuestion | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: patientQuestionId,
          asker: { id: askerId }, // need to set @RelationId
        },
      })

      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionRepository findByIdAndAskerId error',
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
        .createQueryBuilder('patient_questions')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionRepository deleteById error',
        e as Error
      )
    }
  }

  public async findAndCountAll(
    limit: number,
    offset: number
  ): Promise<{
    totalCounts: number
    questions: Array<{
      id: string
      content: string
      createdAt: Date
      answerCounts: number
    }>
  }> {
    try {
      const result = await this.getRepo()
        .createQueryBuilder('question')
        .select('COUNT(answer.id)', 'answerCounts')
        .addSelect('question.id', 'id')
        .addSelect('question.content', 'content')
        .addSelect('question.created_at', 'createdAt')
        .leftJoin(
          'patient_question_answers',
          'answer',
          'answer.patient_question_id = question.id'
        )
        .groupBy('question.id')
        .orderBy('question.created_at', 'DESC')
        .limit(limit)
        .offset(offset)
        .getRawMany()

      const totalCounts: number = await this.getRepo().count()

      return {
        totalCounts,
        questions: result.map((question) => ({
          id: question.id,
          content: question.content,
          createdAt: question.createdAt,
          answerCounts: parseInt(question.answerCounts),
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionRepository findAndCountAll error',
        e as Error
      )
    }
  }
}
