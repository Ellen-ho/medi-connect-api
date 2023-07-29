import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { MedicalSpecialtyType } from '../../domain/question/PatientQuestion'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { IPatientQuestionRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionRepository'
import dayjs from 'dayjs'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { User, UserRoleType } from '../../domain/user/User'
import { DoctorRepository } from '../../infrastructure/entities/doctor/DoctorRepository'
import { AnswerAppreciationRepository } from '../../infrastructure/entities/question/AnswerAppreciationRepository'

interface GetSingleQuestionRequest {
  user: User
  patientQuestionId: string
}

interface GetSingleQuestionResponse {
  question: {
    content: string
    askerAge: number
  }
  answers: IAnswer[]
}

export interface IAnswerItem {
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
}

export interface IAnswer {
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
  isAnswerByMe: boolean
  isThanked: boolean
  isAgreed: boolean
  agreedDoctors: Array<{
    doctorId: string
    avatar: string | null
    firstName: string
    lastName: string
  }>
}

export class GetSingleQuestionUseCase {
  constructor(
    private readonly patientQuestionRepository: IPatientQuestionRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: DoctorRepository,
    private readonly answerAppreciationRepository: AnswerAppreciationRepository
  ) {}

  public async execute(
    request: GetSingleQuestionRequest
  ): Promise<GetSingleQuestionResponse> {
    const { patientQuestionId, user } = request

    const existingPatientQuestion =
      await this.patientQuestionRepository.findById(patientQuestionId)

    if (existingPatientQuestion == null) {
      throw new NotFoundError('Question does not exist.')
    }

    const asker = await this.patientRepository.findById(
      existingPatientQuestion.askerId
    )

    if (asker == null) {
      throw new AuthorizationError('Asker does not exist.')
    }

    const answerDetails =
      await this.patientQuestionAnswerRepository.findAnswerDetailsByQuestionId(
        patientQuestionId
      )

    if (answerDetails.length === 0) {
      return {
        question: {
          content: existingPatientQuestion.content,
          askerAge: dayjs().diff(dayjs(asker.birthDate), 'year'),
        },
        answers: [],
      }
    }

    let answers: IAnswer[] = []

    if (user.role === UserRoleType.DOCTOR) {
      const currentDoctor = await this.doctorRepository.findByUserId(user.id)

      answers = await Promise.all(
        answerDetails.map(async (answer) => {
          let isAgreed = false
          let isAnswerByMe = false

          if (currentDoctor !== null) {
            isAnswerByMe = answer.doctorId === currentDoctor.id

            isAgreed = answer.agreedDoctors.some(
              (doctorItem) => doctorItem.doctorId === currentDoctor.id
            )
          }

          return {
            ...answer,
            agreedDoctors:
              answer.agreedDoctors[0].doctorId == null
                ? []
                : answer.agreedDoctors,
            isAnswerByMe,
            isAgreed,
            isThanked: false,
          }
        })
      )
    } else if (user.role === UserRoleType.PATIENT) {
      const currentPatient = await this.patientRepository.findByUserId(user.id)

      answers = await Promise.all(
        answerDetails.map(async (answer) => {
          let isThanked = false

          if (currentPatient !== null) {
            const answerAppreciation =
              await this.answerAppreciationRepository.findByAnswerIdAndPatientId(
                answer.answerId,
                currentPatient.id
              )

            if (answerAppreciation != null) {
              isThanked = true
            }
          }

          return {
            ...answer,
            agreedDoctors:
              answer.agreedDoctors[0].doctorId == null
                ? []
                : answer.agreedDoctors,
            isAnswerByMe: false,
            isAgreed: false,
            isThanked,
          }
        })
      )
    }

    return {
      question: {
        content: existingPatientQuestion.content,
        askerAge: dayjs().diff(dayjs(asker.birthDate), 'year'),
      },
      answers,
    }
  }
}
