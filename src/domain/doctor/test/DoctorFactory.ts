import { Factory } from 'fishery'
import { Doctor, GenderType, IAddress } from '../Doctor'
import { faker } from '@faker-js/faker'
import { MedicalSpecialtyType } from '../../question/PatientQuestion'
import { User } from '../../user/User'
import { UserFactory } from '../../user/test/UserFactory'

export const DoctorFactory = Factory.define<Doctor>(({ params }) => {
  return new Doctor({
    id: params.id ?? faker.string.uuid(),
    avatar: params.avatar ?? null,
    firstName: params.firstName ?? faker.internet.displayName(),
    lastName: params.lastName ?? faker.internet.displayName(),
    gender: params.gender ?? GenderType.FEMALE,
    aboutMe: params.aboutMe ?? faker.lorem.paragraph(2),
    languagesSpoken: params.languagesSpoken ?? ['English', 'Chinese'],
    specialties: params.specialties ?? [MedicalSpecialtyType.INTERNAL_MEDICINE],
    careerStartDate: params.careerStartDate ?? new Date(),
    officePracticalLocation: (params.officePracticalLocation as IAddress) ?? {
      line1: '123 Fake Street',
      line2: 'Apt 4B',
      city: 'Springfield',
      stateProvince: 'New York',
      postalCode: '12345',
      country: 'United States',
      countryCode: 'US',
    },
    education: params.education ?? ['Harvard University'],
    awards: params.awards ?? null,
    affiliations: params.affiliations ?? null,
    createdAt: params.createdAt ?? new Date(),
    updatedAt: params.createdAt ?? new Date(),
    user: (params.user as User) ?? UserFactory.build(),
  })
})
