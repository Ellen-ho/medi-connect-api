export interface IDoctorTimeSlotProps {
  id: string
  doctorId: string
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
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
}
