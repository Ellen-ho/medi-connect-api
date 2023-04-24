import { Patient } from '../patient/Patient'

export interface IWeightRecordProps {
  id: string
  weightDate: Date
  weightValue: number
  weightUnit: WeightUnitType
  bodyMassIndex: number
  weightNote: string | null
  createdAt: Date
  updatedAt: Date
  patient: Patient
}

export enum WeightUnitType {
  KILOGRAM = 'KILOGRAM',
  POUND = 'POUND',
}

export class WeightRecord {
  constructor(private readonly props: IWeightRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get weightDate(): Date {
    return this.props.weightDate
  }

  public get weightValue(): number {
    return this.props.weightValue
  }

  public get weightUnit(): WeightUnitType {
    return this.props.weightUnit
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

  public get patient(): Patient {
    return this.props.patient
  }
}
