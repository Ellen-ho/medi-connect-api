import { DataSource } from 'typeorm'
import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'
import { PatientQuestionAnswerMapper } from './PatientQuestionAnswerMapper'
import { BaseRepository } from '../../database/BaseRepository'
import { IPatientQuestionAnswerRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { RepositoryError } from '../../error/RepositoryError'
import { IAnswer } from '../../../application/question/GetSingleQuestionUseCase'
import { MedicalSpecialtyType } from '../../../domain/question/PatientQuestion'
import { IExecutor } from '../../../domain/shared/IRepositoryTx'

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

  public async deleteById(
    id: string,
    executor: IExecutor = this.getRepo()
  ): Promise<void> {
    try {
      await executor
        .createQueryBuilder('patient_question_answers')
        .softDelete()
        .where('id = :id', { id })
        .execute()
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository deleteById error',
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

  public async findAnswerDetailsByQuestionIdAndPatientId(
    questionId: string,
    patientId: string
  ): Promise<IAnswer[]> {
    try {
      const rawAnswerDetails = await this.getQuery<
        Array<{
          agreed_doctor_avatars: Array<string | null>
          answer_content: string
          doctor_avatar: string | null
          doctor_first_name: string
          doctor_last_name: string
          doctor_specialties: MedicalSpecialtyType[]
          doctor_career_start_date: Date
          doctor_agreed_counts: number
          answer_thank_counts: number
          answer_is_thanked: boolean
        }>
      >(
        `
          SELECT
            patient_question_answers.content as "answer_content",
            doctors.avatar as "doctor_avatar",
            doctors.first_name as "doctor_first_name",
            doctors.last_name as "doctor_last_name",
            doctors.specialties as "doctor_specialties",
            doctors.career_start_date as "doctor_career_start_date",
            array_agg(answer_agreements.agreed_doctor_id) as "agreed_doctor_avatars",
            COUNT(DISTINCT answer_agreements.id) as "answer_agreed_counts",
            COUNT(DISTINCT answer_appreciations.id) as "answer_thank_counts",
            EXISTS(
              SELECT 1
              FROM answer_appreciations
              WHERE answer_appreciations.patient_id = $2
            ) as "answer_is_thanked"
          FROM patient_question_answers
          LEFT JOIN answer_agreements ON patient_question_answers.id = answer_agreements.patient_question_answer_id
          LEFT JOIN answer_appreciations ON patient_question_answers.id = answer_appreciations.answer_id
          LEFT JOIN doctors ON patient_question_answers.doctor_id = doctors.id
          WHERE patient_question_answers.patient_question_id = $1 
          GROUP BY patient_question_answers.id, doctors.id
        `,
        [questionId, patientId]
      )

      const answerDetails = rawAnswerDetails.map((rawDetail) => ({
        content: rawDetail.answer_content,
        avatar: rawDetail.doctor_avatar,
        firstName: rawDetail.doctor_first_name,
        lastName: rawDetail.doctor_last_name,
        specialties: rawDetail.doctor_specialties,
        careerStartDate: rawDetail.doctor_career_start_date,
        agreeCounts: rawDetail.doctor_agreed_counts,
        thankCounts: rawDetail.answer_thank_counts,
        isThanked: rawDetail.answer_is_thanked,
        doctorAvatars: rawDetail.agreed_doctor_avatars,
      }))

      return answerDetails
    } catch (e) {
      throw new RepositoryError(
        'PatientQuestionAnswerRepository findAnswerDetailsByQuestionIdAndPatientId error',
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
}
