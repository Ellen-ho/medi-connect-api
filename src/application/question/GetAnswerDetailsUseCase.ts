import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import { User } from '../../domain/user/User'
import { DoctorRepository } from '../../infrastructure/entities/doctor/DoctorRepository'
import { AnswerAgreementRepository } from '../../infrastructure/entities/question/AnswerAgreementRepository'
import { AnswerAppreciationRepository } from '../../infrastructure/entities/question/AnswerAppreciationRepository'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

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
    private readonly answerAppreciationRepository: AnswerAppreciationRepository,
    private readonly answerAgreementRepository:AnswerAgreementRepository
  ) {}

  public async execute(
    request: GetAnswerDetailsRequest
  ): Promise<GetAnswerDetailsResponse> {
    const { user, answerId } = request
    const existingDoctor = await this.doctorRepository.findById(user.id)
    if(existingDoctor == null){
      throw new AuthorizationError('Doctor does not exist.')
    }

    const existingAnswer = await this.patientQuestionAnswerRepository.findByIdAndDoctorId(answerId,existingDoctor.id)
    if(existingAnswer == null){
      throw new NotFoundError('This Doctor does not have any answer.')
    }

    const thisAnswerAppreciations = await this.answerAppreciationRepository.findByAnswerId(existingAnswer.id)

    const thisAnswerAgreements = await this.answerAgreementRepository.findByAnswerId(existingAnswer.id)
  



  }
