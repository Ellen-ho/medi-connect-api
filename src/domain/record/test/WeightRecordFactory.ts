import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { WeightRecord } from '../WeightRecord'

export const WeightRecordFactory = Factory.define<WeightRecord>(
  ({ params }) => {
    return new WeightRecord({
      id: params.id ?? faker.string.uuid(),
      weightDate: params.weightDate ?? new Date(),
      weightValueKg: params.weightValueKg ?? 98,
      bodyMassIndex: params.bodyMassIndex ?? 30.24,
      weightNote: params.weightNote ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  }
)
