export interface IExerciseRecordProps {
  id: string
  exerciseDate: Date
  exerciseType: ExerciseType
  duration: number
  intensity: IntensityType
  caloriesBurned: number
}

export enum ExerciseType {
  'WALKING' = 'WALKING',
  'STRETCHING' = 'STRETCHING',
  'YOGA' = 'YOGA',
  'Slow-DANCE' = 'Slow-DANCE',
  'BICYCLE' = 'BICYCLE',
  'GOLF' = 'GOLF',
  'SWIMMING' = 'SWIMMING',
  'PING-PONG' = 'PING-PONG',
  'BASEBALL' = 'BASEBALL',
  'BADMINTON' = 'BADMINTON',
  'FAST-DANCE' = 'FAST-DANCE',
  'WEIGHT-TRAINING' = 'WEIGHT-TRAINING',
  'RUNNING' = 'RUNNING',
  'SPINNING-BIKE' = 'SPINNING-BIKE',
  'BASKETBALL' = 'BASKETBALL',
  'SOCCER' = 'SOCCER',
  'TENNIS' = 'TENNIS',
  'AEROBIC-EXERCISE' = 'AEROBIC-EXERCISE',
  'OTHER' = 'OTHER',
}

export enum IntensityType {
  'LOW' = 'LOW',
  'MODERATE' = 'MODERATE',
  'HIGH' = 'HIGH',
  'OTHER' = 'OTHER',
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

  public get duration(): number {
    return this.props.duration
  }

  public get intensity(): IntensityType {
    return this.props.intensity
  }

  public get caloriesBurned(): number {
    return this.props.caloriesBurned
  }
}
