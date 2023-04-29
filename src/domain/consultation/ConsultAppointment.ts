import { Patient } from '../patient/Patient'
import { DoctorTimeSlot } from './DoctorTimeSlot'

export interface IConsultAppointmentProps {
  id: string
  patient: Patient
  doctorTimeSlot: DoctorTimeSlot
  doctorStatus: DoctorStatusType
  patientStatus: PatientStatusType
  createdAt: Date
  updatedAt: Date
}

export enum DoctorStatusType {
  CANCEL = 'CANCEL',
  NO_SHOW = 'NO_SHOW',
  BE_LATE = 'BE_LATE',
}

export enum PatientStatusType {
  CANCEL = 'CANCEL',
  NO_SHOW = 'NO_SHOW',
  BE_LATE = 'BE_LATE',
}

export class ConsultAppointment {
  constructor(private readonly props: IConsultAppointmentProps) {}

  public get id(): string {
    return this.props.id
  }

  public get patient(): Patient {
    return this.props.patient
  }

  public get doctorTimeSlot(): DoctorTimeSlot {
    return this.props.doctorTimeSlot
  }

  public get doctorStatus(): DoctorStatusType {
    return this.props.doctorStatus
  }

  public get patientStatus(): PatientStatusType {
    return this.props.patientStatus
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
