import { DoctorTimeSlot } from './DoctorTimeSlot'

export interface IConsultAppointmentProps {
  id: string
  meetingLink: string | null
  patientId: string
  doctorTimeSlot: DoctorTimeSlot
  status: ConsultAppointmentStatusType
  createdAt: Date
}

export enum ConsultAppointmentStatusType {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  PATIENT_CANCELED = 'PATIENT_CANCELED',
}

export class ConsultAppointment {
  constructor(private readonly props: IConsultAppointmentProps) {}

  public get id(): string {
    return this.props.id
  }

  public get meetingLink(): string | null {
    return this.props.meetingLink
  }


  public get patientId(): string {
    return this.props.patientId
  }

  public get doctorTimeSlot(): DoctorTimeSlot {
    return this.props.doctorTimeSlot
  }

  public get status(): ConsultAppointmentStatusType {
    return this.props.status
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }
}
