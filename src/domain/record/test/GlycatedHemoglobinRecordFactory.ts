import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { GlycatedHemoglobinRecord } from '../GlycatedHemoglobinRecord'

export const GlycatedHemoglobinRecordFactory =
  Factory.define<GlycatedHemoglobinRecord>(({ params }) => {
    return new GlycatedHemoglobinRecord({
      id: params.id ?? faker.string.uuid(),
      glycatedHemoglobinDate: params.glycatedHemoglobinDate ?? new Date(),
      glycatedHemoglobinValuePercent:
        params.glycatedHemoglobinValuePercent ??
        faker.number.float({ min: 0, max: 10, precision: 0.01 }),
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  })
