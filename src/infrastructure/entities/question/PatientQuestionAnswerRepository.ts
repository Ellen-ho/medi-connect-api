import { DataSource } from 'typeorm'
import { PatientQuestionAnswer } from '../../../domain/question/PatientQuestionAnswer'
import { PatientQuestionAnswerEntity } from './PatientQuestionAnswerEntity'
import { PatientQuestionAnswerMapper } from './PatientQuestionAnswerMapper'
import { BaseRepository } from '../../database/BaseRepository'
import { IPatientQuestionAnswerRepository } from '../../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { RepositoryError } from '../../error/RepositoryError'

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
      console.table({ entity })
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

  public async deleteById(id: string): Promise<void> {
    try {
      await this.getRepo()
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

  public async deleteAllByQuestionId(questionId: string): Promise<void> {
    try {
      await this.getRepo()
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
}
