import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { UserEntity } from '../src/infrastructure/entities/user/UserEntity'
import { DoctorEntity } from '../src/infrastructure/entities/doctor/DoctorEntity'
import { PatientEntity } from '../src/infrastructure/entities/patient/PatientEntity'
import { UserRoleType } from '../src/domain/user/User'
import { BcryptHashGenerator } from '../src/infrastructure/utils/BcryptHashGenerator'
import dotenv from 'dotenv'
import {
  FamilyDiagnosisType,
  GenderType,
  MedicineFrequencyType,
  MedicineTimeType,
  MedicineUnitType,
  PersonalDiagnosisType,
} from '../src/domain/patient/Patient'
import { MedicalSpecialtyType } from '../src/domain/question/PatientQuestion'

dotenv.config()

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity)
    const doctorRepository = dataSource.getRepository(DoctorEntity)
    const patientRepository = dataSource.getRepository(PatientEntity)
    const hashGenerator = new BcryptHashGenerator()
    const hashedPassword = await hashGenerator.hash('12345678')

    const patient1 = {
      id: '5d62a1a6-28c2-4482-82ce-d765ab3a2c78',
      displayName: 'john',
      email: 'john@gmail.com',
      password: hashedPassword,
      role: UserRoleType.PATIENT,
    }

    const doctor1 = {
      id: '399b0926-992b-48f7-818d-a66aee2d6fed',
      displayName: 'jim',
      email: 'jim@gmail.com',
      password: hashedPassword,
      role: UserRoleType.DOCTOR,
    }

    await userRepository.insert([patient1, doctor1])

    await patientRepository.insert({
      avatar: 'https://i.imgur.com/5so0UAu.png',
      firstName: 'John',
      lastName: 'Davis',
      birthDate: new Date('1950-08-15T00:00:00.000Z'),
      gender: GenderType.MALE,
      medicalHistory: [
        {
          diagnosis: PersonalDiagnosisType.DIABETES,
          diagnosisDetails: 'Type 2 diabetes',
        },
        {
          diagnosis: PersonalDiagnosisType.HYPERTENSION,
          diagnosisDetails: 'High blood pressure',
        },
      ],
      allergy: {
        medicine: 'Penicillin',
        food: 'Shellfish',
        other: null,
      },
      familyHistory: [
        {
          relationship: 'Father',
          diagnosis: FamilyDiagnosisType.HYPERTENSION,
          diagnosisDetails: 'High blood pressure',
        },
        {
          relationship: 'Mother',
          diagnosis: FamilyDiagnosisType.DIABETES,
          diagnosisDetails: 'Type 2 diabetes',
        },
      ],
      heightValueCm: 176,
      medicineUsage: [
        {
          medicineName: 'Medication for Diabetes',
          medicineDosage: 1,
          medicineUnit: MedicineUnitType.MILLIGRAM,
          medicineFrequency: MedicineFrequencyType.ONCE_DAILY,
          medicineTime: MedicineTimeType.BEFORE_MEAL,
        },
        {
          medicineName: 'Antihypertensive Medication',
          medicineDosage: 1,
          medicineUnit: MedicineUnitType.MILLIGRAM,
          medicineFrequency: MedicineFrequencyType.ONCE_DAILY,
          medicineTime: MedicineTimeType.AFTER_MEAL,
        },
      ],
      user: patient1,
    })

    await doctorRepository.insert({
      avatar: 'https://i.imgur.com/GEkMq5X.png',
      firstName: 'Jim',
      lastName: 'Williams',
      gender: GenderType.MALE,
      aboutMe:
        "With a focus on preserving and enhancing visual well-being, I'm committed to offering personalized eye care solutions.",
      languagesSpoken: ['English'],
      specialties: [MedicalSpecialtyType.OPHTHALMOLOGY],
      careerStartDate: '2016-07-20T00:00:00.000Z',
      officePracticalLocation: {
        line1: '789 Oak Avenue',
        line2: 'Suite 5D',
        city: 'Los Angeles',
        stateProvince: 'CA',
        postalCode: '90001',
        country: 'United States',
        countryCode: 'US',
      },
      education: ['Johns Hopkins University School of Medicine'],
      awards: [
        'International Council of Ophthalmology (ICO) Excellence in Ophthalmology Award',
      ],
      affiliations: [
        'Advancements in Retinal Imaging Techniques: Implications for Early Detection and Management of Ocular Diseases',
      ],
      user: doctor1,
    })
  }
}
