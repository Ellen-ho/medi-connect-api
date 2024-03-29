export interface IPatientQuestionProps {
  id: string
  content: string
  medicalSpecialty: MedicalSpecialtyType
  createdAt: Date
  updatedAt: Date
  askerId: string
}

export enum MedicalSpecialtyType {
  INTERNAL_MEDICINE = 'INTERNAL_MEDICINE', // 內科
  SURGERY = 'SURGERY', // 外科
  OBSTETRICS_AND_GYNECOLOGY = 'OBSTETRICS_AND_GYNECOLOGY', // 婦產科
  PEDIATRICS = 'PEDIATRICS', // 兒科
  OPHTHALMOLOGY = 'OPHTHALMOLOGY', // 眼科
  OTORHINOLARYNGOLOGY = 'OTORHINOLARYNGOLOGY', // 耳鼻喉科
  DERMATOLOGY = 'DERMATOLOGY', // 皮膚科
  PSYCHIATRY = 'PSYCHIATRY', // 精神科
  DENTISTRY = 'DENTISTRY', // 牙科
  ORTHOPEDICS = 'ORTHOPEDICS', // 骨科
  UROLOGY = 'UROLOGY', // 泌尿科
  NEUROLOGY = 'NEUROLOGY', // 神經科
  NEUROSURGERY = 'NEUROSURGERY', // 神經外科
  CARDIOLOGY = 'CARDIOLOGY', // 心臟內科
  CARDIOTHORACIC_SURGERY = 'CARDIOTHORACIC_SURGERY', // 心臟外科
  ONCOLOGY = 'ONCOLOGY', // 腫瘤科
  NEPHROLOGY = 'NEPHROLOGY', // 腎臟科
  PULMONOLOGY = 'PULMONOLOGY', // 肺科
  GASTROENTEROLOGY = 'GASTROENTEROLOGY', // 消化科
  PULMONARY_MEDICINE = 'PULMONARY_MEDICINE', // 胸腔內科
}

interface IPatientQuestionUpdateData {
  [key: string]: any
  content: string
  medicalSpecialty: MedicalSpecialtyType
}

export class PatientQuestion {
  constructor(private readonly props: IPatientQuestionProps) {}

  public get id(): string {
    return this.props.id
  }

  public get content(): string {
    return this.props.content
  }

  public get medicalSpecialty(): MedicalSpecialtyType {
    return this.props.medicalSpecialty
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get askerId(): string {
    return this.props.askerId
  }

  public updateData(data: IPatientQuestionUpdateData): void {
    this.props.content = data.content
    this.props.medicalSpecialty = data.medicalSpecialty
  }
}
