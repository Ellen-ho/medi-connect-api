import { IAnswer } from '../../../../application/question/GetSingleQuestionUseCase'
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
  deleteById: (id: string, executor?: IExecutor) => Promise<void>
  findAnswerDetailsByQuestionIdAndPatientId: (
    questionId: string,
    patientId: string
  ) => Promise<IAnswer[]>
  countByDoctorId: (doctorId: string) => Promise<number>
  countAppreciatedAnswersByDoctorId: (doctorId: string) => Promise<number>
  countAgreedAnswersByDoctorId: (doctorId: string) => Promise<number>
}
