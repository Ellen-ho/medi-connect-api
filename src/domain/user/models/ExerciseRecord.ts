export interface IExerciseRecordProps {
  id: string
  exerciseDate: string
  exerciseType: string
  duration: string
  intensity: string
  caloriesBurned: string
}

export class ExerciseRecord {
  constructor(private readonly props: IExerciseRecordProps) {}

  public get id(): string {
    return this.props.id
  }

}
