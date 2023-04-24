import { Patient } from '../patient/Patient'

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
  patient: Patient
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

  public get patient(): Patient {
    return this.props.patient
  }
}
