import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ExerciseRecord, ExerciseType, IntensityType } from '../ExerciseRecord'

export const ExerciseRecordFactory = Factory.define<ExerciseRecord>(
  ({ params }) => {
    return new ExerciseRecord({
      id: params.id ?? faker.string.uuid(),
      exerciseDate: params.exerciseDate ?? new Date(),
      exerciseType: params.exerciseType ?? ExerciseType.AEROBIC_EXERCISE,
      exerciseDurationMinute:
        params.exerciseDurationMinute ?? faker.number.int({ min: 0 }),
      exerciseIntensity: params.exerciseIntensity ?? IntensityType.HIGH,
      kcaloriesBurned:
        params.kcaloriesBurned ??
        faker.number.float({ min: 0, precision: 0.01 }),
      exerciseNote: params.exerciseNote ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  }
)
