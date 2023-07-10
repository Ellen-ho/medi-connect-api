import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { MedicalSpecialtyType, PatientQuestion } from '../PatientQuestion'

export const PatientQuestionFactory = Factory.define<PatientQuestion>(
  ({ params }) => {
    return new PatientQuestion({
      id: params.id ?? faker.string.uuid(),
      content: params.content ?? faker.lorem.sentence(5),
      medicalSpecialty:
        params.medicalSpecialty ?? MedicalSpecialtyType.INTERNAL_MEDICINE,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
      askerId: params.askerId ?? faker.string.uuid(),
    })
  }
)
