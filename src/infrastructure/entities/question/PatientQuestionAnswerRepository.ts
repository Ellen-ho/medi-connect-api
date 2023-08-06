import { DataSource } from 'typeorm'
import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'
import { PatientQuestionAnswerMapper } from './PatientQuestionAnswerMapper'
import { BaseRepository } from '../../database/BaseRepository'
import { IPatientQuestionAnswerRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IAnswerItem } from '../../../application/question/GetSingleQuestionUseCase'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'
import { MedicalSpecialtyType } from '../../../domain/question/PatientQuestion'

export class PatientQuestionAnswerRepository
  extends BaseRepository<PatientQuestionAnswerEntity, PatientQuestionAnswer>
  implements IPatientQuestionAnswerRepository
{
  constructor(dataSource: DataSource) {
    super(
      PatientQuestionAnswerEntity,
      new PatientQuestionAnswerMapper(),
      dataSource
    )
  }

  public async findById(id: string): Promise<PatientQuestionAnswer | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: { id },
        relations: ['patientQuestion'], // if no @RalationId set, you need to add relations here
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findById error',
        e as Error
      )
    }
  }

  public async findByIdAndDoctorId(
    patientQuestionAnswerId: string,
    doctorId: string
  ): Promise<PatientQuestionAnswer | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          id: patientQuestionAnswerId,
          doctor: { id: doctorId }, // need to set @RelationId
        },
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findByIdAndDoctorId error',
        e as Error
      )
    }
  }

  public async findByQuestionIdAndDoctorId(
    patientQuestionId: string,
    doctorId: string
  ): Promise<PatientQuestionAnswer | null> {
    try {
      const entity = await this.getRepo().findOne({
        where: {
          patientQuestion: { id: patientQuestionId },
          doctor: { id: doctorId }, // need to set @RelationId
        },
        relations: ['patientQuestion'], // if no @RalationId set, you need to add relations here
      })
      return entity != null ? this.getMapper().toDomainModel(entity) : null
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findByQuestionIdAndDoctorId error',
        e as Error
      )
    }
  }

  public async findAllByQuestionId(
    questionId: string
  ): Promise<PatientQuestionAnswer[]> {
    try {
      const entities = await this.getRepo()
        .createQueryBuilder('patient_question_answers')
        .where('patient_question_id = :questionId', {
          questionId,
        })
        .getMany()
      return entities.map((entity) => this.getMapper().toDomainModel(entity))
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findAllByQuestionId error',
        e as Error
      )
    }
  }

  public async delete(
    answer: PatientQuestionAnswer,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      const entity = this.getMapper().toPersistence(answer)
      await executor.softRemove(entity)
    } catch (e) {
      throw new RepositoryError(
        `PatientQuestionAnswerRepository delete error: ${(e as Error).message}`,
        e as Error
      )
    }
  }

  public async deleteAllByQuestionId(
    questionId: string,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      await executor
        .createQueryBuilder('patient_question_answers')
        .softDelete()
        .where('patient_question_id = :questionId', { questionId })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository deleteAllByQuestionId error',
        e as Error
      )
    }
  }

  public async findAnswerDetailsByQuestionId(
    questionId: string
  ): Promise<IAnswerItem[]> {
    try {
      const rawAnswerItems = await this.getQuery<
        Array<{
          answerId: string
          answerCreatedAt: Date
          content: string
          doctorId: string
          avatar: string | null
          firstName: string
          lastName: string
          specialties: MedicalSpecialtyType[]
          careerStartDate: Date
          agreeCounts: number
          thankCounts: number
          agreedDoctors: Array<{
            doctorId: string
            avatar: string | null
            firstName: string
            lastName: string
          }>
        }>
      >(
        `
      SELECT
        patient_question_answers.id as "answerId",
        patient_question_answers.created_at as "answerCreatedAt",
        patient_question_answers.content as "content",
        doctors.id as "doctorId",
        doctors.avatar as "avatar",
        doctors.first_name as "firstName",
        doctors.last_name as "lastName",
        doctors.specialties as "specialties",
        doctors.career_start_date as "careerStartDate",
        COUNT(DISTINCT answer_agreements.id) as "agreeCounts",
        COUNT(DISTINCT answer_appreciations.id) as "thankCounts",
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'doctorId', agreed_doctors.id,
            'avatar', agreed_doctors.avatar,
            'firstName', agreed_doctors.first_name,
            'lastName', agreed_doctors.last_name
          )
        ) as "agreedDoctors"
      FROM patient_question_answers
      LEFT JOIN answer_agreements ON patient_question_answers.id = answer_agreements.patient_question_answer_id AND answer_agreements.deleted_at IS NULL
      LEFT JOIN answer_appreciations ON patient_question_answers.id = answer_appreciations.answer_id AND answer_appreciations.deleted_at IS NULL
      LEFT JOIN doctors ON patient_question_answers.doctor_id = doctors.id
      LEFT JOIN doctors as agreed_doctors ON answer_agreements.agreed_doctor_id = agreed_doctors.id
      WHERE patient_question_answers.patient_question_id = $1
      GROUP BY patient_question_answers.id, doctors.id;
  `,
        [questionId]
      )

      const answerDetails: IAnswerItem[] = rawAnswerItems.map(
        (rawAnswerItem) => ({
          answerId: rawAnswerItem.answerId,
          answerCreatedAt: rawAnswerItem.answerCreatedAt,
          content: rawAnswerItem.content,
          doctorId: rawAnswerItem.doctorId,
          avatar: rawAnswerItem.avatar !== 'null' ? rawAnswerItem.avatar : null,
          firstName: rawAnswerItem.firstName,
          lastName: rawAnswerItem.lastName,
          specialties: rawAnswerItem.specialties,
          careerStartDate: rawAnswerItem.careerStartDate,
          agreeCounts: rawAnswerItem.agreeCounts,
          thankCounts: rawAnswerItem.thankCounts,
          agreedDoctors: rawAnswerItem.agreedDoctors.map(
            (agreedDoctor: any) => ({
              doctorId: agreedDoctor.doctorId,
              avatar:
                agreedDoctor.avatar === 'null' ? null : agreedDoctor.avatar,
              firstName: agreedDoctor.firstName,
              lastName: agreedDoctor.lastName,
            })
          ),
        })
      )
      return answerDetails
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findAnswerDetailsByQuestionId error',
        e as Error
      )
    }
  }

  public async countByDoctorId(doctorId: string): Promise<number> {
    try {
      const count = await this.getRepo().count({
        where: { doctor: { id: doctorId } },
      })
      return count
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository countByDoctorId error',
        e as Error
      )
    }
  }

  public async countAppreciatedAnswersByDoctorId(
    doctorId: string
  ): Promise<number> {
    try {
      const rawCounts = await this.getQuery<Array<{ count: number }>>(
        `
        SELECT COUNT(DISTINCT patient_question_answers.id) as count
        FROM patient_question_answers
        JOIN answer_appreciations ON patient_question_answers.id = answer_appreciations.answer_id
        WHERE patient_question_answers.doctor_id = $1
      `,
        [doctorId]
      )
      return Number(rawCounts[0].count)
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository countAppreciatedAnswersByDoctorId error',
        e as Error
      )
    }
  }

  public async countAgreedAnswersByDoctorId(doctorId: string): Promise<number> {
    try {
      const rawCounts = await this.getQuery<Array<{ count: number }>>(
        `
          SELECT COUNT(*) as count
          FROM patient_question_answers AS patient_question_answer
          JOIN answer_agreements ON patient_question_answer.id = answer_agreements.patient_question_answer_id
          WHERE patient_question_answer.doctor_id = $1
        `,
        [doctorId]
      )
      return Number(rawCounts[0].count)
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository countAgreedAnswersByDoctorId error',
        e as Error
      )
    }
  }

  public async findAndCountByDoctorId(
    doctorId: string,
    limit: number,
    offset: number
  ): Promise<{
    totalAnswerCounts: number
    data: Array<{
      id: string
      content: string
      createdAt: Date
      thankCounts: number
      agreeCounts: number
    }>
  }> {
    try {
      const rawAnswerItems = await this.getQuery<
        Array<{
          answerId: string
          answerCreatedAt: Date
          content: string
          agreeCounts: number
          thankCounts: number
        }>
      >(
        `
        SELECT
        patient_question_answers.id as "answerId",
        patient_question_answers.created_at as "answerCreatedAt",
        patient_question_answers.content as "content",
        COUNT(DISTINCT answer_agreements.id) as "agreeCounts",
        COUNT(DISTINCT answer_appreciations.id) as "thankCounts"
      FROM patient_question_answers
      LEFT JOIN answer_agreements ON patient_question_answers.id = answer_agreements.patient_question_answer_id AND answer_agreements.deleted_at IS NULL
      LEFT JOIN answer_appreciations ON patient_question_answers.id = answer_appreciations.answer_id AND answer_appreciations.deleted_at IS NULL
      WHERE patient_question_answers.doctor_id = $1
      GROUP BY patient_question_answers.id
      LIMIT $2 OFFSET $3
  `,
        [doctorId, limit, offset]
      )

      const totalAnswerCounts = rawAnswerItems.length
      const data = rawAnswerItems.map((rawItem) => ({
        id: rawItem.answerId,
        content: rawItem.content,
        createdAt: rawItem.answerCreatedAt,
        thankCounts: rawItem.thankCounts,
        agreeCounts: rawItem.agreeCounts,
      }))
      return { totalAnswerCounts, data }
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findAndCountByDoctorId error',
        e as Error
      )
    }
  }
}
