import { HealthGoal } from '../../../domain/goal/HealthGoal'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { HealthGoalEntity } from './HealthGoalEntity'

export class HealthGoalMapper
  implements IEntityMapper<HealthGoalEntity, HealthGoal>
{
  public toDomainModel(entity: HealthGoalEntity): HealthGoal {
    const healthGoal = new HealthGoal({
      id: entity.id,
      bloodPressureTargetValue: entity.bloodPressureTargetValue,
      bloodSugarTargetValue: entity.bloodSugarTargetValue,
      bloodSugarTargetType: entity.bloodSugarTargetType,
      glycatedHemonglobinTargetValue: entity.glycatedHemonglobinTargetValue,
      weightTargetValue: entity.weightTargetValue,
      bodyMassIndexTargetValue: entity.bodyMassIndexTargetValue,
      startAt: entity.startAt,
      endAt: entity.endAt,
      status: entity.status,
      result: entity.result,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      patientId: entity.patientId,
      doctorId: entity.doctorId,
    })
    return healthGoal
  }

  public toPersistence(domainModel: HealthGoal): HealthGoalEntity {
    const healthGoalEntity = new HealthGoalEntity()
    healthGoalEntity.id = domainModel.id
    healthGoalEntity.bloodPressureTargetValue =
      domainModel.bloodPressureTargetValue
    healthGoalEntity.bloodSugarTargetValue = domainModel.bloodSugarTargetValue
    healthGoalEntity.bloodSugarTargetType = domainModel.bloodSugarTargetType
    healthGoalEntity.glycatedHemonglobinTargetValue =
      domainModel.glycatedHemonglobinTargetValue
    healthGoalEntity.weightTargetValue = domainModel.weightTargetValue
    healthGoalEntity.bodyMassIndexTargetValue =
      domainModel.bodyMassIndexTargetValue
    healthGoalEntity.startAt = domainModel.startAt
    healthGoalEntity.endAt = domainModel.endAt
    healthGoalEntity.status = domainModel.status
    healthGoalEntity.result = domainModel.result
    healthGoalEntity.createdAt = domainModel.createdAt
    healthGoalEntity.updatedAt = domainModel.updatedAt
    healthGoalEntity.patientId = domainModel.patientId
    healthGoalEntity.doctorId = domainModel.doctorId

    return healthGoalEntity
  }
}
