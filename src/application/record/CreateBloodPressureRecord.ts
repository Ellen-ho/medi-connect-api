import { Patient } from '../../domain/patient/Patient'
import { BloodPressureRecord } from '../../domain/record/BloodPressureRecord'
import { IBloodPressureRecordRepository } from '../../domain/record/interfaces/repositories/IBloodPressureRecordRepository'

import { IUuidService } from '../../domain/utils/IUuidService'

interface CreateBloodPressureRecordRequestDTO {
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
}

interface CreateBloodPressureRecordResponseDTO {
  id: string
  bloodPressureDate: Date
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartBeat: number
  bloodPressureNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateBloodPressureRecord {
  constructor(
    private readonly bloodPressureRecordRepository: IBloodPressureRecordRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateBloodPressureRecordRequestDTO
  ): Promise<CreateBloodPressureRecordResponseDTO> {
    const {
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      heartBeat,
      bloodPressureNote,
    } = request

    const bloodPressureRecord = new BloodPressureRecord({
      id: this.uuidService.generateUuid(),
      bloodPressureDate,
      systolicBloodPressure,
      diastolicBloodPressure,
      bloodPressureNote,
      heartBeat,
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: new Patient(),
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
      patient: bloodPressureRecord.patient,
    }
  }
}
