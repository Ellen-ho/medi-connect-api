import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { DoctorRepository } from '../../infrastructure/entities/doctor/DoctorRepository'
import { AnswerAppreciationRepository } from '../../infrastructure/entities/question/AnswerAppreciationRepository'

interface GetAnswerDetailsRequest {
  user: User
  answerId:string
}

interface GetAnswerDetailsResponse {
  questionId: string
  answerId: string
  answerContent: string
  appreciationData: Array<{
    content: string | null
    patientId: string
    patientAge: number
    createdAt: Date
  }>
  agreementData: Array<{
    comment: string | null
    agreedDoctorId: string
    agreedDoctorFirstName: string
    agreedDoctorLastName: string
    createdAt: Date
  }>
}

export class GetAnswerDetailsUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly answerAppreciationRepository: AnswerAppreciationRepository
  ) {}

  public async execute(
    request: GetAnswerDetailsRequest
  ): Promise<GetAnswerDetailsResponse> {
    const { user, answerId } = request
    const  existingAnswer = ''
  }
