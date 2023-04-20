export interface IFoodRecordProps {
  id: string
  foodImage: string
  foodTime: string
  foodItem: string
  foodCategory: string
  amount: string
  calories: string
  foodNote: string
}

export class FoodRecord {
  constructor(private readonly props: IFoodRecordProps) {}

  public get id(): string {
    return this.props.id
  }

  public get foodImage(): string {
    return this.props.foodImage
  }

  public get foodTime(): string {
    return this.props.foodTime
  }

  public get foodItem(): string {
    return this.props.foodItem
  }

  public get foodCategory(): string {
    return this.props.foodCategory
  }

  public get amount(): string {
    return this.props.amount
  }

  public get calories(): string {
    return this.props.calories
  }

  public get foodNote (): string {
    return this.props.foodNote
  }
}