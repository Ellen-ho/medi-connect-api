import { DataSource, FindOptionsWhere, Like } from 'typeorm'
import {
  MedicalSpecialtyType,
  PatientQuestion,
} from '../../../domain/question/PatientQuestion'
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
          asker: { id: askerId },
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

  public async delete(
    question: PatientQuestion,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(question)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `PatientQuestionRepository delete error: ${(e as Error).message}`,
        e as Error
      )
    }
  }

  public async findAfterFiteredAndCountAll(
    limit: number,
    offset: number,
    searchKeyword?: string,
    medicalSpecialty?: MedicalSpecialtyType,
    askerId?: string
  ): Promise<{
    totalCounts: number
    questions: Array<{
      id: string
      content: string
      createdAt: Date
      answerCounts: number
      medicalSpecialty: MedicalSpecialtyType
    }>
  }> {
    try {
      const queryBuilder = this.getRepo()
        .createQueryBuilder('patient_questions')
        .select('COUNT(answer.id)', 'answerCounts')
        .addSelect('patient_questions.id', 'id')
        .addSelect('patient_questions.content', 'content')
        .addSelect('patient_questions.created_at', 'createdAt')
        .addSelect('patient_questions.medical_specialty', 'medicalSpecialty')
        .leftJoin(
          'patient_question_answers',
          'answer',
          'answer.patient_question_id = patient_questions.id'
        )
        .groupBy('patient_questions.id')
        .orderBy('patient_questions.created_at', 'DESC')

      const whereConditions: Array<FindOptionsWhere<PatientQuestionEntity>> = []
      if (searchKeyword !== undefined) {
        whereConditions.push({ content: Like(`%${searchKeyword}%`) })
      }
      if (medicalSpecialty !== undefined) {
        whereConditions.push({ medicalSpecialty })
      }

      if (askerId !== undefined) {
        whereConditions.push({ askerId })
      }

      if (whereConditions.length > 0) {
        queryBuilder.where(whereConditions)
      }

      queryBuilder.limit(limit).offset(offset)

      const result = await queryBuilder.getRawMany()

      const totalCounts: number = await this.getRepo().count({
        where: whereConditions.length > 0 ? whereConditions : undefined,
      })

      return {
        totalCounts,
        questions: result.map((question) => ({
          id: question.id,
          content: question.content,
          createdAt: question.createdAt,
          answerCounts: parseInt(question.answerCounts),
          medicalSpecialty: question.medicalSpecialty,
        })),
      }
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionRepository findAfterFiteredAndCountAll error',
        e as Error
      )
    }
  }
}
