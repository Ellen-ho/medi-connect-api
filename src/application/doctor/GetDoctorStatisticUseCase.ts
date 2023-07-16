import { IDoctorRepository } from '../../domain/doctor/interfaces/repositories/IDoctorRepository'
import { IPatientQuestionAnswerRepository } from '../../domain/question/interfaces/repositories/IPatientQuestionAnswerRepository'
import { NotFoundError } from '../../infrastructure/error/NotFoundError'

interface GetDoctorStatisticRequest {
  id: string
}

interface GetDoctorStatisticResponse {
  id: string
  answerCounts: number
  thankedCounts: number
  beAgreedCounts: number
}

export class GetDoctorStatisticUseCase {
  constructor(
    private readonly patientQuestionAnswerRepository: IPatientQuestionAnswerRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  public async execute(
    request: GetDoctorStatisticRequest
  ): Promise<GetDoctorStatisticResponse> {
    const { id } = request

    const existingDoctor = await this.doctorRepository.findById(id)

    if (existingDoctor == null) {
      throw new NotFoundError('Doctor does not exist.')
    }

    const answerCounts =
      await this.patientQuestionAnswerRepository.countByDoctorId(
        existingDoctor.id
      )

    const thankedCounts =
      await this.patientQuestionAnswerRepository.countAppreciatedAnswersByDoctorId(
        existingDoctor.id
      )

    const beAgreedCounts =
      await this.patientQuestionAnswerRepository.countAgreedAnswersByDoctorId(
        existingDoctor.id
      )

    return {
      id: existingDoctor.id,
      answerCounts,
      thankedCounts,
      beAgreedCounts,
    }
  }
}
