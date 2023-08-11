import { BloodSugarType } from '../record/BloodSugarRecord'
import dayjs from 'dayjs'

export interface IHealthGoalProps {
  id: string
  bloodPressureTargetValue: IBloodPressureValue
  bloodSugarTargetValue: number
  bloodSugarTargetType: BloodSugarType
  glycatedHemoglobinTargetValue: number
  weightTargetValue: number
  bodyMassIndexTargetValue: number
  startAt: Date
  endAt: Date
  status: HealthGoalStatus
  result: IHealthGoalResult | null
  createdAt: Date
  updatedAt: Date
  patientId: string
  doctorId: string | null
}

export interface IBloodPressureValue {
  systolicBloodPressure: number | null
  diastolicBloodPressure: number | null
}

// when the goal ends, we need to store the latest records
export interface IHealthGoalResult {
  bloodPressure: IHealthGoalBloodPressureResultItem
  bloodSugar: IHealthGoalResultItem
  glycatedHemoglobin: IHealthGoalResultItem
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
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
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

  public get bloodSugarTargetType(): BloodSugarType {
    return this.props.bloodSugarTargetType
  }

  public get glycatedHemoglobinTargetValue(): number {
    return this.props.glycatedHemoglobinTargetValue
  }

  public get weightTargetValue(): number {
    return this.props.weightTargetValue
  }

  public get bodyMassIndexTargetValue(): number {
    return this.props.bodyMassIndexTargetValue
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

  public get result(): IHealthGoalResult | null {
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

  public get doctorId(): string | null {
    return this.props.doctorId
  }

  public activateGoal(): void {
    this.props.status = HealthGoalStatus.IN_PROGRESS
    const startDate = dayjs()
    const endDate = startDate.add(30, 'day')
    this.props.startAt = startDate.toDate()
    this.props.endAt = endDate.toDate()
  }

  public rejectGoal(): void {
    this.props.status = HealthGoalStatus.REJECTED
  }
}
