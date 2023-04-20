export interface IPatientProps {
  id: string
  avatar: string
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[]
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[]
}

export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

export interface IMedicalHistoryItem {
  diagnosis: PersonalDiagnosisType
  diagnosisDetails?: string
}

enum PersonalDiagnosisType {
  HYPERTENSION = 'HYPERTENSION',
  DIABETES = 'DIABETES',
  HYPERLIPIDEMIA = 'HYPERLIPIDEMIA',
  CANCER = 'CANCER',
  SURGERY = 'SURGERY',
  OTHER = 'OTHER',
}

export interface IFamilyHistoryItem {
  relationship: string
  diagnosis: FamilyDiagnosisType
  diagnosisDetails?: string
}

enum FamilyDiagnosisType {
  HYPERTENSION = 'HYPERTENSION',
  DIABETES = 'DIABETES',
  HYPERLIPIDEMIA = 'HYPERLIPIDEMIA',
  CANCER = 'CANCER',
  OTHER = 'OTHER',
}

export interface IAllergy {
  medicine: string | null
  food: string | null
  other: string | null
}

export class Patient {
  constructor(private readonly props: IPatientProps) {}

  public get id(): string {
    return this.props.id
  }

  public get avatar(): string {
    return this.props.avatar
  }

  public get firstName(): string {
    return this.props.firstName
  }

  public get lastName(): string {
    return this.props.lastName
  }

  public get birthDate(): Date {
    return this.props.birthDate
  }

  public get gender(): GenderType {
    return this.props.gender
  }

  public get medicalHistory(): IMedicalHistoryItem[] {
    return this.props.medicalHistory
  }

  public get allergy(): IAllergy {
    return this.props.allergy
  }

  public get familyHistory(): IFamilyHistoryItem[] {
    return this.props.familyHistory
  }
}
