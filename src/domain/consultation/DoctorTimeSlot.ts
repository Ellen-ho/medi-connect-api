export interface IDoctorTimeSlotProps {
  id: string
  doctorId: string
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
  availability: boolean
}

interface IDoctorTimeSlotUpdateData {
  [key: string]: any
  startAt: Date
  endAt: Date
  availability: boolean
}

export class DoctorTimeSlot {
  constructor(private readonly props: IDoctorTimeSlotProps) {}

  public get id(): string {
    return this.props.id
  }

  public get doctorId(): string {
    return this.props.doctorId
  }

  public get startAt(): Date {
    return this.props.startAt
  }

  public get availability(): boolean {
    return this.props.availability
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

  public updateData(data: IDoctorTimeSlotUpdateData): void {
    // TODO: improve this
    this.props.startAt = data.startAt
    this.props.endAt = data.endAt
    this.props.availability = data.availability
  }
}
