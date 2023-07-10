import { Factory } from 'fishery'
import { BloodSugarRecord, BloodSugarType } from '../BloodSugarRecord'
import { faker } from '@faker-js/faker'

export const BloodSugarRecordFactory = Factory.define<BloodSugarRecord>(
  ({ params }) => {
    return new BloodSugarRecord({
      id: params.id ?? faker.string.uuid(),
      bloodSugarDate: params.bloodSugarDate ?? new Date(),
      bloodSugarValue:
        params.bloodSugarValue ??
        faker.number.float({ min: 0, max: 200, precision: 0.01 }),
      bloodSugarType:
        params.bloodSugarType ?? BloodSugarType.FAST_PLASMA_GLUCOSE,
      bloodSugarNote: params.bloodSugarNote ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  }
)
