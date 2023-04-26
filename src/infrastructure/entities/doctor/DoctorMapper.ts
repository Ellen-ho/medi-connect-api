import { Doctor } from '../../../domain/doctor/interfaces/Doctor'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { UserMapper } from '../user/UserMapper'
import { DoctorEntity } from './DoctorEntity'

export class DoctorMapper implements IEntityMapper<DoctorEntity, Doctor> {
  public toDomainModel(entity: DoctorEntity): Doctor {
    const doctor = new Doctor({
      id: entity.id,
      avatar: entity.avatar,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender,
      aboutMe: entity.aboutMe,
      basedIn: entity.basedIn,
      languagesSpoken: entity.languagesSpoken,
      specialties: entity.specialties,
      yearsOfExperience: entity.yearsOfExperience,
      officePracticalLocation: entity.officePracticalLocation,
      education: entity.education,
      awards: entity.awards,
      affiliations: entity.affiliations,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: new UserMapper().toDomainModel(entity.user),
    })
    return doctor
  }

  public toPersistence(domainModel: Doctor): DoctorEntity {
    const doctorEntity = new DoctorEntity()
    doctorEntity.id = domainModel.id
    doctorEntity.avatar = domainModel.avatar
    doctorEntity.firstName = domainModel.firstName
    doctorEntity.lastName = domainModel.lastName
    doctorEntity.gender = domainModel.gender
    doctorEntity.aboutMe = domainModel.aboutMe
    doctorEntity.basedIn = domainModel.basedIn
    doctorEntity.languagesSpoken = domainModel.languagesSpoken
    doctorEntity.specialties = domainModel.specialties
    doctorEntity.yearsOfExperience = domainModel.yearsOfExperience
    doctorEntity.officePracticalLocation = domainModel.officePracticalLocation
    doctorEntity.education = domainModel.education
    doctorEntity.awards = domainModel.awards
    doctorEntity.affiliations = domainModel.affiliations
    doctorEntity.createdAt = domainModel.createdAt
    doctorEntity.updatedAt = domainModel.updatedAt
    doctorEntity.user = new UserMapper().toPersistence(domainModel.user)

    return doctorEntity
  }
}
