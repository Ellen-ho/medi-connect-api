import { Patient } from '../../../domain/patient/Patient'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { UserMapper } from '../user/UserMapper'
import { PatientEntity } from './PatientEntity'

export class PatientMapper implements IEntityMapper<PatientEntity, Patient> {
  public toDomainModel(entity: PatientEntity): Patient {
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
      heightValueCm: entity.heightValueCm,
      medicinceUsage: entity.medicinceUsage,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: new UserMapper().toDomainModel(entity.user),
    })
    return patient
  }

  public toPersistence(domainModel: Patient): PatientEntity {
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
    patientEntity.heightValueCm = domainModel.heightValueCm
    patientEntity.medicinceUsage = domainModel.medicinceUsage
    patientEntity.createdAt = domainModel.createdAt
    patientEntity.updatedAt = domainModel.updatedAt
    patientEntity.user = new UserMapper().toPersistence(domainModel.user)

    return patientEntity
  }
}
