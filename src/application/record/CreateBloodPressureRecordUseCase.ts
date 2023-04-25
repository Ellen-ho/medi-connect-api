import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { BloodPressureRecord } from '../../domain/record/BloodPressureRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateBloodPressureRecordRequest {
  user: User
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
}

interface CreateBloodPressureRecordResponse {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateBloodPressureRecordUseCase {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateBloodPressureRecordRequest
  ): Promise<CreateBloodPressureRecordResponse> {
    const {
      user,
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      heartBeat,
      bloodPressureNote,
    } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new Error('Patient does not exist.')
    }

    const bloodPressureRecord = new BloodPressureRecord({
      id: this.uuidService.generateUuid(),
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      bloodPressureNote,
      heartBeat,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: existingPatient,
    })
    await this.bloodPressureRecordRepository.save(bloodPressureRecord)

    return {
      id: bloodPressureRecord.id,
      bloodPressureDate: bloodPressureRecord.bloodPressureDate,
      systolicBloodPressure: bloodPressureRecord.systolicBloodPressure,
      diastolicBloodPressure: bloodPressureRecord.diastolicBloodPressure,
      bloodPressureNote: bloodPressureRecord.bloodPressureNote,
      heartBeat: bloodPressureRecord.heartBeat,
      createdAt: bloodPressureRecord.createdAt,
      updatedAt: bloodPressureRecord.updatedAt,
    }
  }
}
