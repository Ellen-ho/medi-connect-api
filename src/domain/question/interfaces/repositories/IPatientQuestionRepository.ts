import { IBaseRepository } from '../../../shared/IBaseRepository'
import { IExecutor } from '../../../shared/IRepositoryTx'
import { MedicalSpecialtyType, PatientQuestion } from '../../PatientQuestion'

export interface IPatientQuestionRepository
  extends IBaseRepository<PatientQuestion> {
  findById: (id: string) => Promise<PatientQuestion | null>
  findByIdAndAskerId: (
    patientQuestionAnswerId: string,
    askerId: string
  ) => Promise<PatientQuestion | null>
  findAndCountAll: (
    limit: number,
    offset: number,
    askerId: string
  ) => Promise<{
    totalCounts: number
    questions: Array<{
      id: string
      content: string
      createdAt: Date
      answerCounts: number
      medicalSpecialty: MedicalSpecialtyType
    }>
  }>
  findAfterFiteredAndCountAll: (
    limit: number,
    offset: number,
    searchKeyword?: string,
    medicalSpecialty?: MedicalSpecialtyType
  ) => Promise<{
    totalCounts: number
    questions: Array<{
      id: string
      content: string
      createdAt: Date
      answerCounts: number
      medicalSpecialty: MedicalSpecialtyType
    }>
  }>
  delete: (question: PatientQuestion, executo?: IExecutor) => Promise<void>
}
