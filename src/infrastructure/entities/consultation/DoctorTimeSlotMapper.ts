import { DoctorTimeSlot } from '../../../domain/consultation/DoctorTimeSlot'
import { IEntityMapper } from '../../../domain/shared/IEntityMapper'
import { DoctorMapper } from '../doctor/DoctorMapper'
import { DoctorTimeSlotEntity } from './DoctorTimeSlotEntity'

export class DoctorTimeSlotMapper
  implements IEntityMapper<DoctorTimeSlotEntity, DoctorTimeSlot>
{
  public toDomainModel(entity: DoctorTimeSlotEntity): DoctorTimeSlot {
    const doctorTimeSlot = new DoctorTimeSlot({
      id: entity.id,
      startAt: entity.startAt,
      endAt: entity.endAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      doctor: new DoctorMapper().toDomainModel(entity.doctor),
    })
    return doctorTimeSlot
  }

  public toPersistence(domainModel: DoctorTimeSlot): DoctorTimeSlotEntity {
    const doctorTimeSlotEntity = new DoctorTimeSlotEntity()
    doctorTimeSlotEntity.id = domainModel.id
    doctorTimeSlotEntity.startAt = domainModel.startAt
    doctorTimeSlotEntity.endAt = domainModel.endAt
    doctorTimeSlotEntity.createdAt = domainModel.createdAt
    doctorTimeSlotEntity.updatedAt = domainModel.updatedAt
    doctorTimeSlotEntity.doctor = new DoctorMapper().toPersistence(
      domainModel.doctor
    )

    return doctorTimeSlotEntity
  }
}
