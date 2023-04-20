import { Patient } from '../../../domain/patient/Patient'
import { PatientEntity } from './PatientEntity'

export class PatientMapper {
  public static toDomainModel(entity: PatientEntity): Patient {
    const patient = new Patient({
      id: entity.id,
      avatar: entity.avatar,
      firstName: entity.firstName,
      lastName: entity.lastName,
      birthDate: entity.birthDate,
      gender: entity.gender,
      medicalHistory: entity.medicalHistory,
      allergy: entity.allergy,
      familyHistory: entity.familyHistory,
    })
    return patient
  }

  public static toPersistence(domainModel: Patient): PatientEntity {
    const patientEntity = new PatientEntity()
    patientEntity.id = domainModel.id
    patientEntity.avatar = domainModel.avatar
    patientEntity.firstName = domainModel.firstName
    patientEntity.lastName = domainModel.lastName
    patientEntity.birthDate = domainModel.birthDate
    patientEntity.gender = domainModel.gender
    patientEntity.medicalHistory = domainModel.medicalHistory
    patientEntity.allergy = domainModel.allergy
    patientEntity.familyHistory = domainModel.familyHistory
    return patientEntity
  }
}
