import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodSugarRecord } from '../../domain/record/BloodSugarRecord'
import { IBloodSugarRecordRepository } from '../../domain/record/interfaces/repositories/IBloodSugarRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateBloodSugarRecordRequest {
  user: User
  bloodSugarDate: Date
  bloodSugarValueMmol: number
  bloodSugarNote: string | null
}

interface CreateBloodSugarRecordResponse {
  id: string
  bloodSugarDate: Date
  bloodSugarValueMmol: number
  bloodSugarNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateBloodSugarRecord {
  constructor(
    private readonly bloodSugarRecordRepository: IBloodSugarRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateBloodSugarRecordRequest
  ): Promise<CreateBloodSugarRecordResponse> {
    const { user, bloodSugarDate, bloodSugarValueMmol, bloodSugarNote } =
      request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const bloodSugarRecord = new BloodSugarRecord({
      id: this.uuidService.generateUuid(),
      bloodSugarDate,
      bloodSugarValueMmol,
      bloodSugarNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: existingPatient,
    })
    await this.bloodSugarRecordRepository.save(bloodSugarRecord)

    return {
      id: bloodSugarRecord.id,
      bloodSugarDate: bloodSugarRecord.bloodSugarDate,
      bloodSugarValueMmol: bloodSugarRecord.bloodSugarValueMmol,
      bloodSugarNote: bloodSugarRecord.bloodSugarNote,
      createdAt: bloodSugarRecord.createdAt,
      updatedAt: bloodSugarRecord.updatedAt,
    }
  }
}
