export interface IFoodRecordProps {
  id: string
  foodImage: string | null
  foodTime: Date
  foodItem: string | null
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
  createdAt: Date
  updatedAt: Date
  patientId: string
}

export enum FoodCategoryType {
  FRUIT = 'FRUIT',
  VEGETABLE = 'VEGETABLE',
  RICE = 'RICE',
  NOODLE = 'NOODLE',
  BREAD = 'BREAD',
  OTHER_GRAINS = 'OTHER_GRAINS',
  DAIRY_PRODUCT = 'DAIRY_PRODUCT',
  MEAT = 'MEAT',
  FISH = 'FISH',
  SEAFOOD = 'SEAFOOD',
  EGG = 'EGG',
  SOY_MILK = 'SOY_MILK',
  SOY_PRODUCT = 'SOY_PRODUCT',
  NUT = 'NUT',
  JUICE = 'JUICE',
  SUGARY_DRINK = 'SUGARY_DRINK',
  SUGAR_FREE_DRINK = 'SUGAR_FREE_DRINK',
  ALCOHOLIC_BEVERAGE = 'ALCOHOLIC_BEVERAGE',
  SNACK = 'SNACK',
}

interface IFoodRecordUpdateData {
  [key: string]: any
  foodTime: Date
  foodCategory: FoodCategoryType
  foodAmount: number
  kcalories: number
  foodNote: string | null
}
export class FoodRecord {
  constructor(private readonly props: IFoodRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get foodImage(): string | null {
    return this.props.foodImage
  }

  public get foodTime(): Date {
    return this.props.foodTime
  }

  public get foodItem(): string | null {
    return this.props.foodItem
  }

  public get foodCategory(): FoodCategoryType {
    return this.props.foodCategory
  }

  public get foodAmount(): number {
    return this.props.foodAmount
  }

  public get kcalories(): number {
    return this.props.kcalories
  }

  public get foodNote(): string | null {
    return this.props.foodNote
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public get patientId(): string {
    return this.props.patientId
  }

  public updateData(data: IFoodRecordUpdateData): void {
    this.props.foodTime = data.foodTime
    this.props.foodCategory = data.foodCategory
    this.props.foodAmount = data.foodAmount
    this.props.kcalories = data.kcalories
    this.props.foodNote = data.foodNote
  }
}
