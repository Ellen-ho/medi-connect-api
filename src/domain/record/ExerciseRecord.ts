export interface IExerciseRecordProps {
  id: string
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  kcaloriesBurned: number
  exerciseNote: string | null
  createdAt: Date
  updatedAt: Date
  patientId: string
}

export enum ExerciseType {
  WALKING = 'WALKING',
  STRETCHING = 'STRETCHING',
  YOGA = 'YOGA',
  SLOW_DANCE = 'SLOW_DANCE',
  BICYCLE = 'BICYCLE',
  GOLF = 'GOLF',
  SWIMMING = 'SWIMMING',
  PING_PONG = 'PING_PONG',
  BASEBALL = 'BASEBALL',
  BADMINTON = 'BADMINTON',
  FAST_DANCE = 'FAST_DANCE',
  WEIGHT_TRAINING = 'WEIGHT_TRAINING',
  RUNNING = 'RUNNING',
  SPINNING_BIKE = 'SPINNING_BIKE',
  BASKETBALL = 'BASKETBALL',
  SOCCER = 'SOCCER',
  TENNIS = 'TENNIS',
  AEROBIC_EXERCISE = 'AEROBIC_EXERCISE',
}

export enum IntensityType {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
}

export interface IExercisekcaloriesPerFiveMin {
  kcaloriesPerFiveMin: number
}

export const exerciseKcaloriesPerFiveMinList: Record<
  ExerciseType,
  IExercisekcaloriesPerFiveMin
> = {
  [ExerciseType.WALKING]: {
    kcaloriesPerFiveMin: 14,
  },
  [ExerciseType.STRETCHING]: {
    kcaloriesPerFiveMin: 11,
  },
  [ExerciseType.YOGA]: {
    kcaloriesPerFiveMin: 11,
  },
  [ExerciseType.SLOW_DANCE]: {
    kcaloriesPerFiveMin: 14,
  },
  [ExerciseType.BICYCLE]: {
    kcaloriesPerFiveMin: 18,
  },
  [ExerciseType.GOLF]: {
    kcaloriesPerFiveMin: 22,
  },
  [ExerciseType.SWIMMING]: {
    kcaloriesPerFiveMin: 24,
  },
  [ExerciseType.PING_PONG]: {
    kcaloriesPerFiveMin: 18,
  },
  [ExerciseType.BASEBALL]: {
    kcaloriesPerFiveMin: 23,
  },
  [ExerciseType.BADMINTON]: {
    kcaloriesPerFiveMin: 25,
  },
  [ExerciseType.FAST_DANCE]: {
    kcaloriesPerFiveMin: 25,
  },
  [ExerciseType.WEIGHT_TRAINING]: {
    kcaloriesPerFiveMin: 25,
  },
  [ExerciseType.RUNNING]: {
    kcaloriesPerFiveMin: 32,
  },
  [ExerciseType.SPINNING_BIKE]: {
    kcaloriesPerFiveMin: 37,
  },
  [ExerciseType.BASKETBALL]: {
    kcaloriesPerFiveMin: 30,
  },
  [ExerciseType.SOCCER]: {
    kcaloriesPerFiveMin: 32,
  },
  [ExerciseType.TENNIS]: {
    kcaloriesPerFiveMin: 33,
  },
  [ExerciseType.AEROBIC_EXERCISE]: {
    kcaloriesPerFiveMin: 33,
  },
}

interface IExerciseRecordUpdateData {
  [key: string]: any
  exerciseDate: Date
  exerciseType: ExerciseType
  exerciseDurationMinute: number
  exerciseIntensity: IntensityType
  kcaloriesBurned: number
  exerciseNote: string | null
}
export class ExerciseRecord {
  constructor(private readonly props: IExerciseRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get exerciseDate(): Date {
    return this.props.exerciseDate
  }

  public get exerciseType(): ExerciseType {
    return this.props.exerciseType
  }

  public get exerciseDurationMinute(): number {
    return this.props.exerciseDurationMinute
  }

  public get exerciseIntensity(): IntensityType {
    return this.props.exerciseIntensity
  }

  public get kcaloriesBurned(): number {
    return this.props.kcaloriesBurned
  }

  public get exerciseNote(): string | null {
    return this.props.exerciseNote
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get patientId(): string {
    return this.props.patientId
  }

  public updateData(data: IExerciseRecordUpdateData): void {
    this.props.exerciseDate = data.exerciseDate
    this.props.exerciseType = data.exerciseType
    this.props.exerciseDurationMinute = data.exerciseDurationMinute
    this.props.exerciseIntensity = data.exerciseIntensity
    this.props.kcaloriesBurned = data.kcaloriesBurned
    this.props.exerciseNote = data.exerciseNote
  }

  public static calculateTotalKcalories(
    exerciseType: ExerciseType,
    exerciseDurationMinute: number
  ): number {
    const targetExerciseKcaloriesPerFiveMin =
      exerciseKcaloriesPerFiveMinList[exerciseType].kcaloriesPerFiveMin

    return Math.round(
      targetExerciseKcaloriesPerFiveMin * (exerciseDurationMinute / 5)
    )
  }
}
