interface ICalculateBodyMassIndex {
  weightValueKg: number
  heightValueCm: number
}

export const calculateBodyMassIndex = ({
  weightValueKg,
  heightValueCm,
}: ICalculateBodyMassIndex): number => {
  const heightValueMeter = heightValueCm / 100
  const bmi = weightValueKg / heightValueMeter ** 2
  return Number(bmi.toFixed(1))
}
