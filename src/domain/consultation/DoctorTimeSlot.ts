import { Doctor } from '../doctor/interfaces/Doctor'

export interface IDoctorTimeSlotProps {
  id: string
  doctor: Doctor
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
}

export class DoctorTimeSlot {
  constructor(private readonly props: IDoctorTimeSlotProps) {}

  public get id(): string {
    return this.props.id
  }

  public get doctor(): Doctor {
    return this.props.doctor
  }

  public get startAt(): Date {
    return this.props.startAt
  }

  public get endAt(): Date {
    return this.props.endAt
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
