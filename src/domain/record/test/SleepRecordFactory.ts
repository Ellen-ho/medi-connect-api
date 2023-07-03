import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { SleepQualityType, SleepRecord } from '../SleepRecord'

export const SleepRecordFactory = Factory.define<SleepRecord>(({ params }) => {
  return new SleepRecord({
    id: params.id ?? faker.string.uuid(),
    sleepDate: params.sleepDate ?? new Date(),
    sleepTime: params.sleepTime ?? new Date(),
    wakeUpTime: params.wakeUpTime ?? new Date(),
    sleepQuality: SleepQualityType.FAIR,
    sleepDurationHour:
      params.sleepDurationHour ??
      faker.number.float({ min: 0, max: 24, precision: 0.01 }),
    sleepNote: params.sleepNote ?? null,
    createdAt: params.createdAt ?? new Date(),
    updatedAt: params.updatedAt ?? new Date(),
    patientId: params.patientId ?? faker.string.uuid(),
  })
})
