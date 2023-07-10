import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { PatientQuestionAnswer } from '../PatientQuestionAnswer'

export const PatientQuestionAnswerFactory =
  Factory.define<PatientQuestionAnswer>(({ params }) => {
    return new PatientQuestionAnswer({
      id: params.id ?? faker.string.uuid(),
      content: params.content ?? faker.lorem.sentence(5),
      patientQuestionId: params.patientQuestionId ?? faker.string.uuid(),
      doctorId: params.doctorId ?? faker.string.uuid(),
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    })
  })
