export interface IMedicationRecordProps {
  id: string
  medicineName: string
  medicineDosage: number
  medicineUnit: medicineUnitType
  medicineFrequency: MedicineFrequencyType
  medicineTime: MedicineTimeType
  prescriptionType:
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
  BEFORE_BREAKFAST = 'BEFORE_BREAKFAST',
  AFTER_BREAKFAST = 'AFTER_ BREAKFAST',
  BEFORE_LUNCH = 'BEFORE_LUNCH',
  AFTER_LUNCH = 'AFTER_LUNCH',
  BEFORE_DINNER = 'BEFORE_DINNER',
  AFTER_DINNER = 'AFTER_DINNER',
  BEFORE_SLEEP = 'BEFORE_SLEEP',
  OTHER = 'OTHER',
}

export class MedicationRecord {
  constructor(private readonly props: IMedicationRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get medicineDosage(): string {
    return this.props.medicineDosage
  }

  public get medicineFrequency(): string {
    return this.props.medicineFrequency
  }

  public get medicineTime(): string {
    return this.props.medicineTime
  }
}
