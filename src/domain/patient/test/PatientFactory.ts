import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { GenderType, IAllergy, Patient } from '../Patient'
import { UserFactory } from '../../user/test/UserFactory'
import { User } from '../../user/User'

export const PatientFactory = Factory.define<Patient>(({ params }) => {
  return new Patient({
    id: params.id ?? faker.string.uuid(),
    avatar: params.avatar ?? null,
    firstName: params.firstName ?? faker.internet.displayName(),
    lastName: params.lastName ?? faker.internet.displayName(),
    birthDate: params.birthDate ?? new Date(),
    gender: params.gender ?? GenderType.FEMALE,
    medicalHistory: params.medicalHistory ?? null,
    allergy: (params.allergy as IAllergy) ?? {
      medicine: null,
      food: null,
      other: null,
    },
    familyHistory: params.familyHistory ?? null,
    heightValueCm: params.heightValueCm ?? 180,
    medicinceUsage: params.medicinceUsage ?? null,
    createdAt: params.createdAt ?? new Date(),
    updatedAt: params.createdAt ?? new Date(),
    user: (params.user as User) ?? UserFactory.build(),
  })
})
