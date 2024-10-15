import dayjs from 'dayjs'
import { IPatientRepository } from '../../domain/patient/interfaces/repositories/IPatientRepository'
import { FoodCategoryType, FoodRecord } from '../../domain/record/FoodRecord'
import { IFoodRecordRepository } from '../../domain/record/interfaces/repositories/IFoodRecordRepository'
import { User } from '../../domain/user/User'
import { IUuidService } from '../../domain/utils/IUuidService'
import { AuthorizationError } from '../../infrastructure/error/AuthorizationError'
import { ValidationError } from '../../infrastructure/error/ValidationError'

interface CreateFoodRecordRequest {
  user: User
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  foodNote: string | null
}

interface CreateFoodRecordResponse {
  id: string
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
  createdAt: Date
  updatedAt: Date
}

export class CreateFoodRecordUseCase {
  constructor(
    private readonly foodRecordRepository: IFoodRecordRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly uuidService: IUuidService
  ) {}

  public async execute(
    request: CreateFoodRecordRequest
  ): Promise<CreateFoodRecordResponse> {
    const { user, foodTime, foodCategory, foodAmount, foodNote } = request

    const existingPatient = await this.patientRepository.findByUserId(user.id)

    if (existingPatient == null) {
      throw new AuthorizationError('Patient does not exist.')
    }

    const today = dayjs().startOf('day')
    const inputDate = dayjs(foodTime).startOf('day')

    if (inputDate.isAfter(today)) {
      throw new ValidationError('The input date is not within a valid range.')
    }

    const foodTimeUTC8 = dayjs(foodTime).add(8, 'hour').toDate()

    const foodRecord = new FoodRecord({
      id: this.uuidService.generateUuid(),
      foodImage: null,
      foodTime: foodTimeUTC8,
      foodItem: null,
      foodCategory,
      foodAmount,
      kcalories: FoodRecord.calculateTotalKcalories(foodCategory, foodAmount),
      foodNote,
      createdAt: new Date(),
      updatedAt: new Date(),
      patientId: existingPatient.id,
    })
    await this.foodRecordRepository.save(foodRecord)

    return {
      id: foodRecord.id,
      foodTime: foodTimeUTC8,
      foodCategory: foodRecord.foodCategory,
      foodAmount: foodRecord.foodAmount,
      kcalories: foodRecord.kcalories,
      foodNote: foodRecord.foodNote,
      createdAt: foodRecord.createdAt,
      updatedAt: foodRecord.updatedAt,
    }
  }
}
