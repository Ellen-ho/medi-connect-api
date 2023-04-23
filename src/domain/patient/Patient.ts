export interface IPatientProps {
  id: string
  avatar: string | null
  firstName: string
  lastName: string
  birthDate: Date
  gender: GenderType
  medicalHistory: IMedicalHistoryItem[] | null
  allergy: IAllergy
  familyHistory: IFamilyHistoryItem[] | null
  height: number
  heightUnit: HeightUnitType
  medicinceUsage: IMedicinceUsageItem[] | null
  createdAt: Date
  updatedAt: Date
}

export enum HeightUnitType {
  CENTIMETER = 'CENTIMETER',
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

export interface IMedicinceUsageItem {
  medicineName: string
  medicineDosage: number
  medicineUnit: medicineUnitType
  medicineFrequency: MedicineFrequencyType
  medicineTime: MedicineTimeType
}

export enum medicineUnitType {
  MILLIGRAM = 'MILLIGRAM',
  MILLILITER = 'MILLILITER',
}

export enum MedicineFrequencyType {
  ONCE_DAILY = 'ONCE_DAILY',
  TWICE_DAILY = 'TWICE_DAILY',
  THREE_TIMES_A_DAY = 'THREE_TIMES_A_DAY',
  FOUR_TIMES_A_DAY = 'FOUR_TIMES_A_DAY',
  OTHER = 'OTHER',
}

export enum MedicineTimeType {
  BEFORE_MEAL = 'BEFORE_MEAL',
  AFTER_MEAL = 'AFTER_MEAL',
  OTHER = 'OTHER',
}

export class Patient {
  constructor(private readonly props: IPatientProps) {}

  public get id(): string {
    return this.props.id
  }

  public get avatar(): string | null {
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

  public get medicalHistory(): IMedicalHistoryItem[] | null {
    return this.props.medicalHistory
  }

  public get allergy(): IAllergy {
    return this.props.allergy
  }

  public get familyHistory(): IFamilyHistoryItem[] | null {
    return this.props.familyHistory
  }

  public get height(): number {
    return this.props.height
  }

  public get heightUnit(): HeightUnitType {
    return this.props.heightUnit
  }

  public get medicinceUsage(): IMedicinceUsageItem[] | null {
    return this.props.medicinceUsage
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
