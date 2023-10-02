import { IAnswerItem } from '../../../../application/question/GetSingleQuestionUseCase'
import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import { PatientQuestionAnswer } from '../../PatientQuestionAnswer'

export interface IPatientQuestionAnswerRepository
  extends IBaseRepository<PatientQuestionAnswer> {
  findById: (id: string) => Promise<PatientQuestionAnswer | null>
  findByIdAndDoctorId: (
    patientQuestionAnswerId: string,
    doctorId: string
  ) => Promise<PatientQuestionAnswer | null>
  findByQuestionIdAndDoctorId: (
    patientQuestionId: string,
    doctorId: string
  ) => Promise<PatientQuestionAnswer | null>
  findAllByQuestionId: (questionId: string) => Promise<PatientQuestionAnswer[]>
  deleteAllByQuestionId: (
    questionId: string,
    executor?: IExecutor
  ) => Promise<void>
  delete: (answer: PatientQuestionAnswer, executor?: IExecutor) => Promise<void>
  findAnswerDetailsByQuestionId: (questionId: string) => Promise<IAnswerItem[]>
  countByDoctorId: (doctorId: string) => Promise<number>
  countAppreciatedAnswersByDoctorId: (doctorId: string) => Promise<number>
  countAgreedAnswersByDoctorId: (doctorId: string) => Promise<number>
  findAndCountByDoctorId: (
    doctorId: string,
    limit: number,
    offset: number
  ) => Promise<{
    totalAnswerCounts: number
    data: Array<{
      id: string
      content: string
      createdAt: Date
      thankCounts: number
      agreeCounts: number
    }>
  }>
  findFilteredAndCountByDoctorId: (
    doctorId: string,
    limit: number,
    offset: number,
    searchKeyword: string
  ) => Promise<{
    totalAnswerCounts: number
    data: Array<{
      id: string
      content: string
      createdAt: Date
      thankCounts: number
      agreeCounts: number
    }>
  }>
}
