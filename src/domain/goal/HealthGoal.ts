export interface IHealthGoalProps {
  id: string
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarTargetValue: number
  glycatedHemonglobinTargetValue: number
  weightTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  result: IHealthGoalResult
  createdAt: Date
  updatedAt: Date
  patientId: string
  doctorId: string
}

export interface IBloodPressureValue {
  systolicBloodPressure: number | null
  diastolicBloodPressure: number | null
}

// when the goal ends, we need to store the latest records
export interface IHealthGoalResult {
  bloodPressure: IHealthGoalBloodPressureResultItem
  bloodSugar: IHealthGoalResultItem
  glycatedHemonglobin: IHealthGoalResultItem
  weight: IHealthGoalResultItem
}

export interface IHealthGoalBloodPressureResultItem {
  currentValue: IBloodPressureValue // fetch the latest records
  goalAchieved: boolean
  currentValueDate: Date
}

export interface IHealthGoalResultItem {
  currentValue: number | null // fetch the latest records
  goalAchieved: boolean
  currentValueDate: Date
}

export enum HealthGoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  ALL_GOALS_ACHIEVED = 'ALL_GOALS_ACHIEVED',
  PARTIAL_GOALS_ACHIEVED = 'PARTIAL_GOALS_ACHIEVED',
  GOAL_FAILED = 'GOAL_FAILED',
}

export class HealthGoal {
  constructor(private readonly props: IHealthGoalProps) {}

  public get id(): string {
    return this.props.id
  }

  public get bloodPressureTargetValue(): IBloodPressureValue {
    return this.props.bloodPressureTargetValue
  }

  public get bloodSugarTargetValue(): number {
    return this.props.bloodSugarTargetValue
  }

  public get glycatedHemonglobinTargetValue(): number {
    return this.props.glycatedHemonglobinTargetValue
  }

  public get weightTargetValue(): number {
    return this.props.weightTargetValue
  }

  public get startAt(): Date {
    return this.props.startAt
  }

  public get endAt(): Date {
    return this.props.endAt
  }

  public get status(): HealthGoalStatus {
    return this.props.status
  }

  public get result(): IHealthGoalResult {
    return this.props.result
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

  public get doctorId(): string {
    return this.props.doctorId
  }
}
