import { Doctor } from '../../domain/doctor/interfaces/Doctor'
import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { AnswerAgreement } from '../../domain/question/AnswerAgreement'
import { PatientQuestionAnswer } from '../../domain/question/PatientQuestionAnswer'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateAnswerAgreementRequest {
  user: User
  answerId: string
  comment: string
}

interface CreateAnswerAgreementResponse {
  id: string
  answerId: string
  totalAgreedDoctorCounts: number
  agreedDoctorAvatars: string[]
  createdAt: Date
  updatedAt: Date
}

export class CreateAnswerAgreementUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateAnswerAgreementRequest
  ): Promise<CreateAnswerAgreementResponse> {
    const { user, answerId, comment } = request

    const existingAnswer = await this.patientQuestionAnswerRepository.findById(
      answerId
    )

    if (existingAnswer == null) {
      throw new Error('Answer does not exist.')
    }

    const existingDoctor = await this.doctorRepository.findByUserId(user.id)

    if (existingDoctor == null) {
      throw new Error('Doctor does not exist.')
    }

    const answerAgreement = new AnswerAgreement({
      id: this.uuidService.generateUuid(),
      comment,
      answer: existingAnswer,
      agreedDoctor: existingDoctor,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await this.answerAgreementRepository.save(AnswerAgreement)

    return {
      id: answerAgreement.id,
      answerId: answerAgreement.answer.id,
      totalAgreedDoctorCounts,
      agreedDoctorAvatars,
      createdAt: answerAgreement.createdAt,
      updatedAt: answerAgreement.updatedAt,
    }
  }
}
