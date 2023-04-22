import { GlycatedHemoglobinRecord } from '../../GlycatedHemoglobinRecord'

export interface IGlycatedHemoglobinRecordRepository {
  findById: (id: string) => Promise<GlycatedHemoglobinRecord | null>
  save: (glycatedHemoglobinRecord: GlycatedHemoglobinRecord) => Promise<void>
}
