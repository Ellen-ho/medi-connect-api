import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { WeightRecord } from '../WeightRecord'

export const WeightRecordRecordFactory = Factory.define<WeightRecord>(
  ({ params }) => {
    return new WeightRecord({
      id: params.id ?? faker.string.uuid(),
      weightDate: params.weightDate ?? new Date(),
      weightValueKg:
        params.weightValueKg ??
        faker.number.float({ min: 0, max: 250, precision: 0.01 }),
      bodyMassIndex:
        params.bodyMassIndex ??
        faker.number.float({ min: 0, max: 40, precision: 0.01 }),
      weightNote: params.weightNote ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  }
)
