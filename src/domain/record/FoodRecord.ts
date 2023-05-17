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

export enum Language {
  ZH_TW = 'zh-TW',
  EN_US = 'en-US',
}

export interface IFoodkcaloriesPerUnitItem {
  kcaloriesPerUnit: number
  examples: Record<Language, string>
}

export const foodKcaloriesPerUnitList: Record<
  FoodCategoryType,
  IFoodkcaloriesPerUnitItem
> = {
  [FoodCategoryType.FRUIT]: {
    kcaloriesPerUnit: 60,
    examples: {
      [Language.ZH_TW]: '1碗切塊8分滿, 1個女生拳頭大',
      [Language.EN_US]:
        "Divided into 8 equal parts in a bowl, equivalent to the size of one girl's fist.",
    },
  },
  [FoodCategoryType.VEGETABLE]: {
    kcaloriesPerUnit: 25,
    examples: {
      [Language.ZH_TW]: '100g, 1/2碗葉菜類, 1碗筍類、瓜類、菇類, 1顆大蕃茄',
      [Language.EN_US]:
        '100g,1/2 bowl of leafy vegetables, 1 bowl of bamboo shoots, melons, and mushrooms, 1 large tomato.',
    },
  },
  [FoodCategoryType.NOODLE]: {
    kcaloriesPerUnit: 70,
    examples: {
      [Language.ZH_TW]: '1/2碗熟麵(60g), 水餃皮3張, 1/4個燒餅',
      [Language.EN_US]:
        '1/2 bowl of cooked noodles (60g), 3 pieces of dumpling wrappers, 1/4 of a baked sesame pancake.',
    },
  },
  [FoodCategoryType.RICE]: {
    kcaloriesPerUnit: 70,
    examples: {
      [Language.ZH_TW]:
        '1/4碗白飯(40g), 1/4碗糙米飯(40g), 1/4碗五穀飯(40g), 1/2碗稀飯(125g)',
      [Language.EN_US]:
        '1/4 bowl of white rice (40g), 1/4 bowl of brown rice (40g), 1/4 bowl of mixed grain rice (40g), 1/2 bowl of porridge (125g).',
    },
  },
  [FoodCategoryType.BREAD]: {
    kcaloriesPerUnit: 70,
    examples: {
      [Language.ZH_TW]: '1/3個中型麵包(30g), 1片薄吐司(30g), 1/3個饅頭(30g)',
      [Language.EN_US]:
        '1/3 medium-sized bread (30g), 1 slice of thin toast (30g), 1/3 steamed bun (30g).',
    },
  },
  [FoodCategoryType.OTHER_GRAINS]: {
    kcaloriesPerUnit: 70,
    examples: {
      [Language.ZH_TW]: '20g, 麥片3湯匙, 五穀粉2湯匙, 薏仁粉2湯匙',
      [Language.EN_US]:
        "20g, 3 tablespoons of oatmeal, 2 tablespoons of multigrain powder, 2 tablespoons of Job's tears powder.",
    },
  },
  [FoodCategoryType.MEAT]: {
    kcaloriesPerUnit: 75,
    examples: {
      [Language.ZH_TW]: '1/2~1/3手掌心大小',
      [Language.EN_US]: 'an apple',
    },
  },
  [FoodCategoryType.FISH]: {
    kcaloriesPerUnit: 75,
    examples: {
      [Language.ZH_TW]: '1/2~1/3手掌心大小',
      [Language.EN_US]: 'About half to one-third the size of your palm.',
    },
  },
  [FoodCategoryType.SEAFOOD]: {
    kcaloriesPerUnit: 75,
    examples: {
      [Language.ZH_TW]: '蝦仁6隻, 草蝦4隻, 文蛤6個',
      [Language.EN_US]: '6 shrimp, 4 mantis shrimp, 6 clams.',
    },
  },
  [FoodCategoryType.EGG]: {
    kcaloriesPerUnit: 75,
    examples: {
      [Language.ZH_TW]: '1顆',
      [Language.EN_US]: '1 piece.',
    },
  },
  [FoodCategoryType.DAIRY_PRODUCT]: {
    kcaloriesPerUnit: 120,
    examples: {
      [Language.ZH_TW]: '牛奶240c.c., 起司2片, 優酪乳240c.c., 奶粉3湯匙(25g)',
      [Language.EN_US]:
        '240ml of milk, 2 slices of cheese, 240ml of yogurt, 3 tablespoons of powdered milk (25g).',
    },
  },
  [FoodCategoryType.SOY_MILK]: {
    kcaloriesPerUnit: 75,
    examples: {
      [Language.ZH_TW]: '無糖豆漿190c.c.',
      [Language.EN_US]: '190ml of unsweetened soy milk.',
    },
  },
  [FoodCategoryType.SOY_PRODUCT]: {
    kcaloriesPerUnit: 75,
    examples: {
      [Language.ZH_TW]: '嫩豆腐半盒, 傳統豆腐兩小方格, 豆干1.5塊',
      [Language.EN_US]:
        'Half a box of soft tofu, two small squares of traditional tofu, 1.5 pieces of dried tofu.',
    },
  },
  [FoodCategoryType.NUT]: {
    kcaloriesPerUnit: 45,
    examples: {
      [Language.ZH_TW]: '杏仁果5顆, 開心果15顆, 核桃仁2顆',
      [Language.EN_US]: 'Five almonds, fifteen pistachios, two walnut kernels.',
    },
  },
  [FoodCategoryType.JUICE]: {
    kcaloriesPerUnit: 60,
    examples: {
      [Language.ZH_TW]: '120c.c.',
      [Language.EN_US]: '120c.c.',
    },
  },
  [FoodCategoryType.SUGARY_DRINK]: {
    kcaloriesPerUnit: 60,
    examples: {
      [Language.ZH_TW]: '全糖150c.c., 半糖300c.c.',
      [Language.EN_US]: '150cc full sugar, 300cc half sugar.',
    },
  },
  [FoodCategoryType.SUGAR_FREE_DRINK]: {
    kcaloriesPerUnit: 0,
    examples: {
      [Language.ZH_TW]: '250c.c.(1杯)',
      [Language.EN_US]: '250cc (1 cup).',
    },
  },
  [FoodCategoryType.ALCOHOLIC_BEVERAGE]: {
    kcaloriesPerUnit: 125,
    examples: {
      [Language.ZH_TW]: '啤酒360c.c., 紅酒150c.c., 威士忌45c.c.',
      [Language.EN_US]: '360cc of beer, 150cc of red wine, 45cc of whisky.',
    },
  },
  [FoodCategoryType.SNACK]: {
    kcaloriesPerUnit: 245,
    examples: {
      [Language.ZH_TW]: '一個泡芙(100g), 10片餅乾(60g) 一片低糖戚風蛋糕.',
      [Language.EN_US]:
        'One cream puff (100g), 10 cookies (60g), one slice of low-sugar sponge cake.',
    },
  },
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

  public static calculateTotalKcalories(
    foodCategory: FoodCategoryType,
    foodAmount: number
  ): number {
    const targetFoodKcaloriesPerUnit =
      foodKcaloriesPerUnitList[foodCategory].kcaloriesPerUnit

    return targetFoodKcaloriesPerUnit * foodAmount
  }
}
