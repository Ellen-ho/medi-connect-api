import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { BloodPressureRecord } from '../BloodPressureRecord'

export const BloodPressureRecordFactory = Factory.define<BloodPressureRecord>(
  ({ params }) => {
    return new BloodPressureRecord({
      id: params.id ?? faker.string.uuid(),
      bloodPressureDate: params.bloodPressureDate ?? new Date(),
      systolicBloodPressure:
        params.systolicBloodPressure ?? faker.number.int({ min: 0, max: 250 }),
      diastolicBloodPressure:
        params.diastolicBloodPressure ?? faker.number.int({ min: 0, max: 150 }),
      heartBeat: params.heartBeat ?? faker.number.int({ min: 0, max: 150 }),
      bloodPressureNote: params.bloodPressureNote ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  }
)
