import { DataSource } from 'typeorm'
import { PatientQuestion } from '../../../domain/question/PatientQuestion'
import { BaseRepository } from '../../database/BaseRepository'
import { PatientQuestionEntity } from './PatientQuestionEntity'
import { PatientQuestionMapper } from './PatientQuestionMapper'
import { IPatientQuestionRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { RepositoryError } from '../../error/RepositoryError'

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

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
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
    total_counts: number
    questions: Array<{
      content: string
    }>
  }> {
    try {
      const rawQuestions = await this.getQuery<
        Array<{
          total_counts: number
          content: string
        }>
      >(
        `
          SELECT
            (SELECT COUNT(*) FROM patient_questions) as total_counts,
            content
          FROM
            patient_questions
          LIMIT $1
          OFFSET $2
        `,
        [limit, offset]
      )

      return {
        total_counts: rawQuestions[0].total_counts,
        questions: rawQuestions.map((question) => ({
          content: question.content,
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
