import { User } from '../user/User'

export interface IWeightRecordProps {
  user: User
  id: string
  weightDate: Date
  weightValueKg: number
  bodyMassIndex: number
  weightNote: string | null
  createdAt: Date
  updatedAt: Date
}

interface IWeightRecordUpdateData {
  [key: string]: any
  weightDate: Date
  weightValueKg: number
  bodyMassIndex: number
  weightNote: string | null
}

export class WeightRecord {
  constructor(private readonly props: IWeightRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get weightDate(): Date {
    return this.props.weightDate
  }

  public get weightValueKg(): number {
    return this.props.weightValueKg
  }

  public get bodyMassIndex(): number {
    return this.props.bodyMassIndex
  }

  public get weightNote(): string | null {
    return this.props.weightNote
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get user(): User {
    return this.props.user
  }

  public updateData(data: IWeightRecordUpdateData): void {
    this.props.weightDate = data.weightDate
    this.props.weightValueKg = data.weightValueKg
    this.props.bodyMassIndex = data.bodyMassIndex
    this.props.weightNote = data.weightNote
  }
}
