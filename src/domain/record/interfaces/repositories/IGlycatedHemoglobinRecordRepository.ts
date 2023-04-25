import { GlycatedHemoglobinRecord } from '../../GlycatedHemoglobinRecord'

export interface IGlycatedHemoglobinRecordRepository {
  findByIdAndPatientId: (
    recordId: string,
    patientId: string
  ) => Promise<GlycatedHemoglobinRecord | null>
  save: (foodRecord: GlycatedHemoglobinRecord) => Promise<void>
}
