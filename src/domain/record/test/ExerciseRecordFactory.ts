import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ExerciseRecord, ExerciseType, IntensityType } from '../ExerciseRecord'

export const ExerciseRecordFactory = Factory.define<ExerciseRecord>(
  ({ params }) => {
    return new ExerciseRecord({
      id: params.id ?? faker.string.uuid(),
      exerciseDate: params.exerciseDate ?? new Date(),
      exerciseType: params.exerciseType ?? ExerciseType.AEROBIC_EXERCISE,
      exerciseDurationMinute: params.exerciseDurationMinute ?? 30,
      exerciseIntensity: params.exerciseIntensity ?? IntensityType.HIGH,
      kcaloriesBurned: params.kcaloriesBurned ?? 198,
      exerciseNote: params.exerciseNote ?? null,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      patientId: params.patientId ?? faker.string.uuid(),
    })
  }
)
