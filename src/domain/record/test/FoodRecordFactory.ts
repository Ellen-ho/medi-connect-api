import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { FoodCategoryType, FoodRecord } from '../FoodRecord'

export const FoodRecordFactory = Factory.define<FoodRecord>(({ params }) => {
  return new FoodRecord({
    id: params.id ?? faker.string.uuid(),
    foodImage: params.foodImage ?? null,
    foodTime: params.foodTime ?? new Date(),
    foodItem: params.foodItem ?? null,
    foodCategory: params.foodCategory ?? FoodCategoryType.EGG,
    foodAmount: params.foodAmount ?? faker.number.int({ min: 0 }),
    kcalories:
      params.kcalories ?? faker.number.float({ min: 0, precision: 0.01 }),
    foodNote: params.foodNote ?? null,
    createdAt: params.createdAt ?? new Date(),
    updatedAt: params.updatedAt ?? new Date(),
    patientId: params.patientId ?? faker.string.uuid(),
  })
})
