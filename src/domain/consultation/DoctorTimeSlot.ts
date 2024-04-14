export interface IDoctorTimeSlotProps {
  id: string
  doctorId: string
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  availability: boolean
  type: TimeSlotType
}

interface IDoctorTimeSlotUpdateData {
  [key: string]: any
  startAt: Date
  endAt: Date
}

export enum TimeSlotType {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL',
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

  public get type(): TimeSlotType {
    return this.props.type
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get deletedAt(): Date | null {
    return this.props.deletedAt
  }

  public updateAvailability(availability: boolean): void {
    this.props.availability = availability
  }

  public updateData(data: IDoctorTimeSlotUpdateData): void {
    // TODO: improve this
    this.props.startAt = data.startAt
    this.props.endAt = data.endAt
  }
}
