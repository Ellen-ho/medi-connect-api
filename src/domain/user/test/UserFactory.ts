import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { User, UserRoleType } from '../User'

export const UserFactory = Factory.define<User>(({ params }) => {
  return new User({
    id: params.id ?? faker.string.uuid(),
    email: params.email ?? faker.internet.email(),
    hashedPassword: params.hashedPassword ?? faker.internet.password(),
    displayName: params.displayName ?? faker.internet.userName(),
    role: params.role ?? UserRoleType.PATIENT,
    createdAt: params.createdAt ?? new Date(),
    updatedAt: params.updatedAt ?? new Date(),
  })
})
