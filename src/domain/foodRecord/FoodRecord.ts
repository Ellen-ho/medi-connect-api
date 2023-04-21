export interface IFoodRecordProps {
  id: string
  foodImage: string | null
  foodTime: Date
  foodItem: string | null
  foodCategory: FoodCategoryType
  amount: number
  calories: number
  foodNote: string | null
}

export enum FoodCategoryType {
  'FRUIT' = 'FRUIT',
  'VEGETABLE' = 'VEGETABLE',
  'RICE' = 'RICE',
  'NOODLE' = 'NOODLE',
  'BREAD' = 'BREAD',
  'OTHER_GRAINS' = 'OTHER_GRAINS',
  'DAIRY_PRODUCT' = 'DAIRY_PRODUCT',
  'MEAT ' = 'MEAT',
  'FISH' = 'FISH',
  'SEAFOOD' = 'SEAFOOD',
  'EGG' = 'EGG',
  'SOY_MILK' = 'SOY_MILK',
  'SOY_PRODUCT' = 'SOY_PRODUCT',
  'NUT' = 'NUT',
  'JUICE' = 'JUICE',
  'SUGARY_DRINK' = 'SUGARY_DRINK',
  'SUGAR_FREE_DRINK' = 'SUGAR_FREE_DRINK',
  'ALCOHOLIC_BEVERAGE' = 'ALCOHOLIC_BEVERAGE',
  'SNACK' = 'SNACK',
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

  public get amount(): number {
    return this.props.amount
  }

  public get calories(): number {
    return this.props.calories
  }

  public get foodNote(): string | null {
    return this.props.foodNote
  }
}
